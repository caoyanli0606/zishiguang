const STORAGE_KEY = 'zishiguang-words-v1';
const HISTORY_KEY = 'zishiguang-history-v1';
const REVIEW_LOG_KEY = 'zishiguang-review-log-v1';
const TEXTBOOK_KEY = 'zishiguang-textbook-v1';
const TEXTBOOK_CATALOG_ID = 'textbook-catalog-v1';
const VOICE_KEY = 'zishiguang-voice-v1';

const $ = (selector) => document.querySelector(selector);
const today = () => new Date().toLocaleDateString('sv-SE');
const formatDate = (date) => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function showDialog(dialog) {
  try {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else throw new Error('dialog unsupported');
  } catch (error) {
    dialog.classList.add('fallback-dialog');
    dialog.setAttribute('open', '');
  }
}

function closeDialog(dialog) {
  if (typeof dialog.close === 'function' && dialog.open) dialog.close();
  else dialog.removeAttribute('open');
  dialog.classList.remove('fallback-dialog');
}

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let queue = [];
let queueIndex = 0;
let reviewedCount = 0;
let reviewLog = JSON.parse(localStorage.getItem(REVIEW_LOG_KEY) || '{}');
let libraryMode = 'added';
let libraryFilters = { added: 'all', reviewed: today() };
let textbookWords = JSON.parse(localStorage.getItem(TEXTBOOK_KEY) || '[]');
let reviewContext = 'daily';
let selectedLessonKeys = new Set();
let editingLessonKey = null;
let pairGroupIndex = 0;
let selectedPairChar = null;
let listenTarget = null;
let listenScore = 0;

const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([...new Set(history)]));
}

function saveReviewLog() {
  localStorage.setItem(REVIEW_LOG_KEY, JSON.stringify(reviewLog));
}

function saveTextbookWords() {
  localStorage.setItem(TEXTBOOK_KEY, JSON.stringify(textbookWords));
}

async function loadRemoteTextbookCatalog() {
  const config = window.CLOUD_CONFIG;
  if (!config?.url || !config?.publishableKey) return;
  try {
    const endpoint = `${config.url}/rest/v1/family_data?family_id=eq.${TEXTBOOK_CATALOG_ID}&select=payload`;
    const response = await fetch(endpoint, {
      headers: { apikey: config.publishableKey, 'x-family-id': TEXTBOOK_CATALOG_ID },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error(`catalog ${response.status}`);
    const rows = await response.json();
    const lessons = rows[0]?.payload?.lessons;
    if (!Array.isArray(lessons)) throw new Error('catalog payload missing');

    const existingCatalogById = new Map(textbookWords.filter((word) => word.catalog).map((word) => [word.id, word]));
    const manualWords = textbookWords.filter((word) => !word.catalog);
    const remoteWords = [];
    lessons.forEach((lesson) => {
      const semester = lesson.semester === '上册' ? 1 : 2;
      [...lesson.characters].forEach((char, charIndex) => {
        const id = `catalog-${lesson.grade}-${semester}-${lesson.lesson_order}-${charIndex}-${char}`;
        const previous = existingCatalogById.get(id);
        remoteWords.push({
          ...previous,
          id,
          char,
          grade: Number(lesson.grade),
          semester,
          bookUnit: lesson.unit_name || '课本课时',
          unit: lesson.lesson_name,
          lessonOrder: Number(lesson.lesson_order),
          charOrder: charIndex,
          level: previous?.level || 0,
          reviewCount: previous?.reviewCount || 0,
          createdAt: previous?.createdAt || today(),
          source: 'textbook',
          catalog: true
        });
      });
    });
    textbookWords = [...manualWords, ...remoteWords];
    saveTextbookWords();
    renderTextbook();
  } catch (error) {
    console.warn('课本字表同步失败，将继续使用本机数据。', error);
  }
}

function levelText(level) {
  return ['新认识', '再练练', '有点熟', '已掌握'][level || 0];
}

function showView(id) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === id));
  const isMainView = id === 'homeView' || id === 'textbookView';
  $('.topbar').style.display = isMainView ? 'flex' : 'none';
  $('.hero').style.display = id === 'homeView' ? 'flex' : 'none';
  $('#mainNav').style.display = isMainView ? 'grid' : 'none';
  $('#homeNav').classList.toggle('active', id === 'homeView');
  $('#textbookNav').classList.toggle('active', id === 'textbookView');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome() {
  const due = words.filter((word) => !word.nextReview || word.nextReview <= today());
  const reviewedToday = (reviewLog[today()] || []).filter((entry) => !entry.source || entry.source === 'daily');
  $('#dueCount').textContent = due.length;
  $('#startReview').disabled = due.length === 0;
  $('#startReview span:first-child').textContent = due.length ? '开始今日复习' : '今天已经复习完啦';
  $('#homeReviewAgain').hidden = reviewedToday.length === 0;
  renderLibrary();
  renderStreak();
}

function renderLibrary() {
  const filter = libraryFilters[libraryMode];
  const groups = {};
  if (libraryMode === 'added') {
    words.forEach((word) => {
      if (filter !== 'all' && word.createdAt !== filter) return;
      (groups[word.createdAt] ||= []).push({ ...word, displayLevel: levelText(word.level) });
    });
  } else {
    Object.entries(reviewLog).forEach(([date, entries]) => {
      if (filter !== 'all' && date !== filter) return;
      groups[date] = entries.map((entry) => ({ ...entry, id: `${date}-${entry.char}`, displayLevel: levelText(entry.level) }));
    });
  }
  const dates = Object.keys(groups).sort().reverse();
  const count = dates.reduce((sum, date) => sum + groups[date].length, 0);
  $('#libraryTitle').textContent = libraryMode === 'added' ? '录入字库' : '每日复习字库';
  $('#totalCount').textContent = filter === 'all' ? `共 ${count} 个字` : `${count} 个字`;
  $('#addedTab').classList.toggle('active', libraryMode === 'added');
  $('#reviewedTab').classList.toggle('active', libraryMode === 'reviewed');
  $('#addedTab').setAttribute('aria-selected', libraryMode === 'added');
  $('#reviewedTab').setAttribute('aria-selected', libraryMode === 'reviewed');
  $('#allDates').classList.toggle('active', filter === 'all');
  $('#libraryDate').value = filter === 'all' ? '' : filter;
  $('#wordList').innerHTML = dates.map((date) => {
    const entries = groups[date].sort((a, b) => (a.char || '').localeCompare(b.char || '', 'zh-CN'));
    const tiles = entries.map((entry) => `<button class="word-tile level-${entry.level || 0}" data-id="${entry.id}" aria-label="${entry.char}，${entry.displayLevel}">
      <span class="level-dot"></span><b>${entry.char}</b><small>${entry.displayLevel}</small>
    </button>`).join('');
    return `<section class="date-group"><div class="date-group-head"><h3>${formatDate(date)}</h3><span>${entries.length} 个字</span></div><div class="word-list">${tiles}</div></section>`;
  }).join('');
  const empty = count === 0;
  $('#emptyLibrary').classList.toggle('show', empty);
  $('#emptyAdd').style.display = libraryMode === 'added' ? 'inline-block' : 'none';
  $('#emptyLibraryTitle').textContent = libraryMode === 'added' ? '这一天还没有录入汉字' : '这一天还没有复习记录';
  $('#emptyLibraryText').textContent = libraryMode === 'added' ? '添加认识的新字，它会出现在这里。' : '完成复习后，系统会自动记录当天复习的字。';
}

function switchLibraryMode(mode) {
  libraryMode = mode;
  renderLibrary();
}

function gradeText(grade) {
  return ['','一','二','三','四','五','六'][Number(grade)] + '年级';
}

function semesterText(semester) {
  return Number(semester) === 1 ? '上册' : '下册';
}

function getFilteredTextbookWords() {
  return textbookWords;
}

function lessonKey(word) {
  return `${word.grade}|${word.semester}|${word.unit || '未分课时'}`;
}

function sortTextbookWords(entries) {
  return entries.slice().sort((a, b) => Number(a.grade) - Number(b.grade)
    || Number(a.semester) - Number(b.semester)
    || Number(a.lessonOrder || 9999) - Number(b.lessonOrder || 9999)
    || (a.unit || '未分课时').localeCompare(b.unit || '未分课时', 'zh-CN', { numeric: true })
    || Number(a.charOrder ?? 9999) - Number(b.charOrder ?? 9999)
    || a.char.localeCompare(b.char, 'zh-CN'));
}

function visibleLessonKeys() {
  return [...new Set(getFilteredTextbookWords().map(lessonKey))];
}

function updateLessonSelectionUI() {
  const visibleKeys = visibleLessonKeys();
  const selectedCount = selectedLessonKeys.size;
  $('#lessonReviewTools').hidden = textbookWords.length === 0;
  $('#shuffleLessonReview').hidden = selectedCount === 0;
  $('#selectedLessonCount').textContent = selectedCount;
  $('#toggleAllLessons').textContent = visibleKeys.length && visibleKeys.every((key) => selectedLessonKeys.has(key)) ? '取消全选' : '全选课时';
}

function renderTextbook() {
  const filtered = sortTextbookWords(getFilteredTextbookWords());
  $('#textbookTotal').textContent = textbookWords.length;
  $('#filteredTextbookCount').textContent = filtered.length;
  $('#knownTextbookCount').textContent = filtered.filter((word) => word.level === 3).length;
  $('#startTextbookReview').disabled = filtered.length === 0;
  $('#emptyTextbook').classList.toggle('show', filtered.length === 0);
  const groups = new Map();
  filtered.forEach((word) => {
    const bookKey = `${word.grade}-${word.semester}`;
    if (!groups.has(bookKey)) groups.set(bookKey, { grade: word.grade, semester: word.semester, units: new Map() });
    const unitName = word.bookUnit || '自定义课时';
    const units = groups.get(bookKey).units;
    if (!units.has(unitName)) units.set(unitName, new Map());
    const key = lessonKey(word);
    const lessons = units.get(unitName);
    if (!lessons.has(key)) lessons.set(key, []);
    lessons.get(key).push(word);
  });
  $('#textbookWordList').innerHTML = [...groups.values()].map((book) => {
    const allLessons = [...book.units.values()].flatMap((lessons) => [...lessons.values()]);
    const bookCount = allLessons.reduce((sum, entries) => sum + entries.length, 0);
    const lessonCount = allLessons.length;
    const unitsHtml = [...book.units.entries()].map(([unitName, lessons]) => {
      const unitCount = [...lessons.values()].reduce((sum, entries) => sum + entries.length, 0);
      const lessonsHtml = [...lessons.entries()].map(([key, entries]) => {
        const encodedKey = encodeURIComponent(key);
        const lessonName = entries[0].unit || '未分课时';
        const tiles = entries.map((word) => `<button class="word-tile level-${word.level || 0}" data-textbook-id="${word.id}" aria-label="${word.char}，${levelText(word.level)}">
          <span class="level-dot"></span><b>${word.char}</b><small>${levelText(word.level)}</small>
        </button>`).join('');
        return `<details class="lesson-card"><summary class="lesson-card-head"><div><h4>${escapeHtml(lessonName)}</h4><small>${entries.length} 个字</small></div><div class="lesson-actions"><button class="lesson-review-button" type="button" data-review-lesson="${encodedKey}">复习</button><button type="button" data-edit-lesson="${encodedKey}">编辑</button></div><span class="lesson-toggle"></span></summary><div class="lesson-select-row"><label class="lesson-checkbox"><input type="checkbox" data-lesson-select="${encodedKey}" ${selectedLessonKeys.has(key) ? 'checked' : ''}><span></span></label><b>选择此课时参加乱序复习</b></div><div class="word-list">${tiles}</div></details>`;
      }).join('');
      return `<details class="textbook-unit"><summary class="textbook-unit-head"><h4>${escapeHtml(unitName)}</h4><span>${lessons.size} 个课时 · ${unitCount} 个字</span><i class="hierarchy-toggle"></i></summary><div class="textbook-unit-body">${lessonsHtml}</div></details>`;
    }).join('');
    return `<details class="textbook-group"><summary class="textbook-group-head"><h3>${gradeText(book.grade)}${semesterText(book.semester)}</h3><span>${book.units.size} 个单元 · ${lessonCount} 个课时 · ${bookCount} 个字</span><i class="hierarchy-toggle"></i></summary><div class="textbook-group-body">${unitsHtml}</div></details>`;
  }).join('');
  updateLessonSelectionUI();
}

function openTextbookDialog(key = null) {
  $('#textbookForm').reset();
  editingLessonKey = key;
  const isEditing = Boolean(key);
  $('#textbookDialogTitle').textContent = isEditing ? '编辑课时识字表' : '录入课本生字';
  $('#textbookSubmit').textContent = isEditing ? '保存课时修改' : '保存识字表';
  $('#textbookGrade').disabled = isEditing;
  $('#textbookSemester').disabled = isEditing;
  if (isEditing) {
    const entries = textbookWords.filter((word) => lessonKey(word) === key);
    if (!entries.length) return showToast('没有找到这个课时');
    const first = entries[0];
    $('#textbookGrade').value = String(first.grade);
    $('#textbookSemester').value = String(first.semester);
    $('#textbookUnit').value = first.unit || '未分课时';
    $('#textbookInput').value = entries.map((word) => word.char).join('');
  }
  showDialog($('#textbookDialog'));
  setTimeout(() => $('#textbookInput').focus(), 100);
}

function addTextbookWords(event) {
  event.preventDefault();
  const chars = [...new Set([...$('#textbookInput').value].filter((char) => /[\u3400-\u9fff]/.test(char)))];
  if (!chars.length) return showToast('请输入至少一个汉字');
  const grade = Number($('#textbookGrade').value);
  const semester = Number($('#textbookSemester').value);
  const unit = $('#textbookUnit').value.trim();
  if (!unit) return showToast('请填写课时名称');
  if (editingLessonKey) {
    const oldEntries = textbookWords.filter((word) => lessonKey(word) === editingLessonKey);
    const oldIds = new Set(oldEntries.map((word) => word.id));
    const acceptedChars = chars.filter((char) => !textbookWords.some((word) => !oldIds.has(word.id) && word.grade === grade && word.semester === semester && word.char === char));
    const acceptedSet = new Set(acceptedChars);
    const wasSelected = selectedLessonKeys.delete(editingLessonKey);
    textbookWords = textbookWords.filter((word) => !oldIds.has(word.id) || acceptedSet.has(word.char));
    textbookWords.forEach((word) => { if (oldIds.has(word.id)) word.unit = unit; });
    acceptedChars.forEach((char, index) => {
      if (!textbookWords.some((word) => oldIds.has(word.id) && word.char === char)) {
        textbookWords.push({ id: `tb-${Date.now()}-${index}-${char}`, char, grade, semester, unit, level: 0, reviewCount: 0, createdAt: today(), source: 'textbook' });
      }
    });
    if (wasSelected) selectedLessonKeys.add(`${grade}|${semester}|${unit}`);
    saveTextbookWords();
    editingLessonKey = null;
    renderTextbook();
    closeDialog($('#textbookDialog'));
    showToast(acceptedChars.length < chars.length ? '课时已保存，已跳过本册中的重复字' : '课时修改已保存');
    return;
  }
  let added = 0;
  chars.forEach((char, index) => {
    if (textbookWords.some((word) => word.char === char && word.grade === grade && word.semester === semester)) return;
    textbookWords.push({ id: `tb-${Date.now()}-${index}-${char}`, char, grade, semester, unit, level: 0, reviewCount: 0, createdAt: today(), source: 'textbook' });
    added += 1;
  });
  saveTextbookWords();
  renderTextbook();
  closeDialog($('#textbookDialog'));
  $('#textbookForm').reset();
  showToast(added ? `已录入 ${added} 个课本生字` : '这些字已在本册识字表中');
}

function startTextbookReview() {
  queue = sortTextbookWords(getFilteredTextbookWords()).map((word) => ({ ...word, source: 'textbook' }));
  if (!queue.length) return;
  reviewContext = 'textbook';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function startLessonReview(key) {
  queue = sortTextbookWords(textbookWords.filter((word) => lessonKey(word) === key)).map((word) => ({ ...word, source: 'textbook' }));
  if (!queue.length) return showToast('这个课时还没有生字');
  reviewContext = 'textbook';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function startShuffledLessonReview() {
  const selectedWords = textbookWords.filter((word) => selectedLessonKeys.has(lessonKey(word))).map((word) => ({ ...word, source: 'textbook' }));
  if (!selectedWords.length) return showToast('请先选择至少一个课时');
  for (let index = selectedWords.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [selectedWords[index], selectedWords[randomIndex]] = [selectedWords[randomIndex], selectedWords[index]];
  }
  queue = selectedWords;
  reviewContext = 'textbook';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function toggleAllVisibleLessons() {
  const keys = visibleLessonKeys();
  const shouldSelect = !keys.every((key) => selectedLessonKeys.has(key));
  keys.forEach((key) => shouldSelect ? selectedLessonKeys.add(key) : selectedLessonKeys.delete(key));
  renderTextbook();
}

function renderStreak() {
  const history = getHistory().sort().reverse();
  let streak = 0;
  const cursor = new Date(`${today()}T12:00:00`);
  if (!history.includes(today())) cursor.setDate(cursor.getDate() - 1);
  while (history.includes(cursor.toLocaleDateString('sv-SE'))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  $('#streakCount').textContent = `${streak} 天`;
}

function openAddDialog() {
  $('#wordDate').value = today();
  showDialog($('#addDialog'));
  setTimeout(() => $('#wordInput').focus(), 100);
}

function addWords(event) {
  event.preventDefault();
  const raw = $('#wordInput').value.trim();
  const chars = [...new Set([...raw].filter((char) => /[\u3400-\u9fff]/.test(char)))];
  if (!chars.length) return showToast('请输入至少一个汉字');
  const date = $('#wordDate').value;
  const note = $('#wordNote').value.trim();
  let added = 0;
  chars.forEach((char) => {
    if (words.some((word) => word.char === char)) return;
    words.push({ id: `${Date.now()}-${char}`, char, note, createdAt: date, nextReview: date, level: 0, reviewCount: 0 });
    added += 1;
  });
  saveWords();
  renderHome();
  closeDialog($('#addDialog'));
  $('#addForm').reset();
  showToast(added ? `已添加 ${added} 个字` : '这些字已经在字库里啦');
}

function startReview() {
  queue = words.filter((word) => !word.nextReview || word.nextReview <= today()).map((word) => ({ ...word, source: 'daily' }));
  if (!queue.length) return;
  reviewContext = 'daily';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function renderCard() {
  const word = queue[queueIndex];
  const card = $('#wordCard');
  card.className = 'word-card enter';
  $('#reviewWord').textContent = word.char;
  $('#memoryCue').textContent = word.note || `大声读一读「${word.char}」`;
  $('#reviewDate').textContent = word.source === 'textbook'
    ? `${gradeText(word.grade)}${semesterText(word.semester)}${word.unit ? ` · ${word.unit}` : ''}`
    : `${formatDate(word.createdAt)}认识`;
  $('#reviewProgress').textContent = `${queueIndex + 1} / ${queue.length}`;
  $('#progressBar').style.width = `${(queueIndex / queue.length) * 100}%`;
  $('#reviewedCountDisplay').textContent = reviewedCount;
  $('#remainingCount').textContent = queue.length - queueIndex;
  $('#revealPrompt').textContent = '先自己读一读，再点卡片看提示';
  if (queueIndex === 0) prepareReviewModes();
}

function getPinyin(char) {
  try {
    return window.pinyinPro?.pinyin(char, { toneType: 'symbol' }) || '—';
  } catch (error) {
    return '—';
  }
}

function uniqueQueueWords() {
  return [...new Map(queue.map((word) => [word.char, word])).values()];
}

function shuffled(items) {
  const result = items.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function switchReviewMode(mode) {
  document.querySelectorAll('[data-review-mode]').forEach((button) => button.classList.toggle('active', button.dataset.reviewMode === mode));
  document.querySelectorAll('.review-mode-panel').forEach((panel) => panel.classList.remove('active'));
  $(`#${mode}ModePanel`).classList.add('active');
  if (mode === 'overview') renderReviewOverview();
  if (mode === 'pair') renderPairGroup();
  if (mode === 'listen') startListenRound();
}

function prepareReviewModes() {
  pairGroupIndex = 0;
  selectedPairChar = null;
  listenTarget = null;
  listenScore = 0;
  $('#listenScore').textContent = '答对 0 个';
  switchReviewMode('card');
  renderReviewOverview();
}

function renderReviewOverview() {
  const entries = uniqueQueueWords();
  $('#overviewCount').textContent = `${entries.length} 个字`;
  $('#reviewOverviewGrid').innerHTML = entries.map((word) => `<button type="button" class="overview-word" data-overview-char="${word.char}"><span>${getPinyin(word.char)}</span><b>${word.char}</b><small>${levelText(word.level)}</small></button>`).join('');
}

function renderPairGroup() {
  const entries = uniqueQueueWords();
  const totalGroups = Math.max(1, Math.ceil(entries.length / 4));
  if (pairGroupIndex >= totalGroups) pairGroupIndex = 0;
  const group = entries.slice(pairGroupIndex * 4, pairGroupIndex * 4 + 4);
  selectedPairChar = null;
  $('#pairProgress').textContent = `第 ${pairGroupIndex + 1} / ${totalGroups} 组`;
  $('#nextPairGroup').hidden = true;
  $('#pairChars').innerHTML = shuffled(group).map((word, index) => `<button type="button" class="pair-choice" data-kind="char" data-pair-char="${word.char}" data-pair-id="c-${pairGroupIndex}-${index}">${word.char}</button>`).join('');
  $('#pairPinyins').innerHTML = shuffled(group).map((word, index) => `<button type="button" class="pair-choice" data-kind="pinyin" data-pair-pinyin="${getPinyin(word.char)}" data-pair-id="p-${pairGroupIndex}-${index}">${getPinyin(word.char)}</button>`).join('');
}

function handlePairChoice(event) {
  const charButton = event.target.closest('[data-pair-char]');
  const pinyinButton = event.target.closest('[data-pair-pinyin]');
  if (charButton && !charButton.classList.contains('matched')) {
    document.querySelectorAll('[data-pair-char].selected').forEach((button) => button.classList.remove('selected'));
    selectedPairChar = charButton;
    charButton.classList.add('selected');
    return;
  }
  if (!pinyinButton || !selectedPairChar || pinyinButton.classList.contains('matched')) return;
  const expected = getPinyin(selectedPairChar.dataset.pairChar);
  if (pinyinButton.dataset.pairPinyin === expected) {
    selectedPairChar.classList.remove('selected');
    selectedPairChar.classList.add('matched');
    pinyinButton.classList.add('matched');
    speakGameText(selectedPairChar.dataset.pairChar);
    selectedPairChar = null;
    if ([...document.querySelectorAll('[data-pair-char]')].every((button) => button.classList.contains('matched'))) $('#nextPairGroup').hidden = false;
  } else {
    pinyinButton.classList.add('wrong');
    setTimeout(() => pinyinButton.classList.remove('wrong'), 420);
  }
}

function nextPairGroup() {
  pairGroupIndex += 1;
  renderPairGroup();
}

function startListenRound() {
  const entries = shuffled(uniqueQueueWords());
  const choices = entries.slice(0, Math.min(4, entries.length));
  if (!choices.length) return;
  listenTarget = choices[Math.floor(Math.random() * choices.length)];
  $('#listenChoices').innerHTML = shuffled(choices).map((word) => `<button type="button" class="listen-choice" data-listen-char="${word.char}">${word.char}</button>`).join('');
  $('#listenFeedback').textContent = '仔细听，再选择对应的汉字';
  setTimeout(playListenTarget, 180);
}

function playListenTarget() {
  if (listenTarget) speakGameText(listenTarget.char);
}

function handleListenChoice(event) {
  const button = event.target.closest('[data-listen-char]');
  if (!button || !listenTarget) return;
  if (button.dataset.listenChar === listenTarget.char) {
    button.classList.add('correct');
    $('#listenFeedback').textContent = `答对了！这是「${listenTarget.char}」`;
    listenScore += 1;
    $('#listenScore').textContent = `答对 ${listenScore} 个`;
    speakFeedback('圈圈，你真是太棒了');
    listenTarget = null;
    setTimeout(startListenRound, 900);
  } else {
    button.classList.add('wrong');
    $('#listenFeedback').textContent = '再听一次，慢慢找';
    setTimeout(() => button.classList.remove('wrong'), 450);
    playListenTarget();
  }
}

function speakGameText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.72;
  utterance.pitch = 1;
  applySelectedVoice(utterance);
  window.speechSynthesis.speak(utterance);
}

function rateWord(level) {
  window.speechSynthesis?.cancel();
  if (level === 3) speakFeedback('圈圈，你真是太棒了');
  if (level === 2) speakFeedback('很好，圈圈，下次就认识了');
  if (level === 1) speakFeedback('圈圈，你要加油哦，我相信你');
  const current = queue[queueIndex];
  const isTextbook = current.source === 'textbook' || reviewContext === 'textbook';
  const collection = isTextbook ? textbookWords : words;
  const word = collection.find((item) => item.id === current.id);
  if (!word) return showToast('没有找到这个字，请返回后重试');
  const days = level === 1 ? 0 : level === 2 ? 2 : 7;
  const next = new Date();
  next.setDate(next.getDate() + days);
  word.level = level;
  word.reviewCount = (word.reviewCount || 0) + 1;
  word.lastReviewed = today();
  if (!isTextbook) word.nextReview = next.toLocaleDateString('sv-SE');
  const date = today();
  const entries = reviewLog[date] ||= [];
  const logEntry = { char: word.char, level, reviewedAt: new Date().toISOString(), source: isTextbook ? 'textbook' : 'daily', wordId: word.id };
  const existingEntry = entries.find((entry) => entry.char === word.char && (entry.source || 'daily') === logEntry.source && (!entry.wordId || entry.wordId === word.id));
  if (existingEntry) Object.assign(existingEntry, logEntry);
  else entries.push(logEntry);
  saveReviewLog();
  if (isTextbook) saveTextbookWords();
  else saveWords();
  reviewedCount += 1;

  const card = $('#wordCard');
  card.classList.add(level === 1 ? 'fly-left' : 'fly-right');
  setTimeout(() => {
    queueIndex += 1;
    if (queueIndex < queue.length) renderCard();
    else finishReview();
  }, 230);
}

function finishReview() {
  const history = getHistory();
  if (!history.includes(today())) history.push(today());
  saveHistory(history);
  $('#completeSummary').textContent = `你刚刚复习了 ${reviewedCount} 个${reviewContext === 'textbook' ? '课本生' : ''}字，真不错。`;
  $('#backHome').textContent = reviewContext === 'textbook' ? '回到课本识字' : '回到首页';
  showView('completeView');
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function speakCurrentWord(event) {
  event.stopPropagation();
  const char = $('#reviewWord').textContent;
  if (!('speechSynthesis' in window)) return showToast('当前浏览器不支持语音朗读');
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(char);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.72;
  utterance.pitch = 1;
  applySelectedVoice(utterance);
  const button = $('#speakWord');
  utterance.onstart = () => button.classList.add('speaking');
  utterance.onend = utterance.onerror = () => button.classList.remove('speaking');
  window.speechSynthesis.speak(utterance);
}

function speakFeedback(message) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  applySelectedVoice(utterance);
  window.speechSynthesis.speak(utterance);
}

function getChineseVoices() {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter((voice) => /^zh(?:[-_]|$)/i.test(voice.lang));
}

function selectedSystemVoice() {
  const saved = localStorage.getItem(VOICE_KEY);
  const voices = getChineseVoices();
  return voices.find((voice) => voice.voiceURI === saved || voice.name === saved) || voices[0] || null;
}

function applySelectedVoice(utterance) {
  const voice = selectedSystemVoice();
  if (voice) utterance.voice = voice;
}

function voiceRegion(lang) {
  const code = String(lang || '').toLowerCase();
  if (code.includes('tw')) return '台湾';
  if (code.includes('hk')) return '香港';
  return '普通话';
}

function refreshVoiceOptions() {
  const select = $('#voiceSelect');
  if (!select) return;
  const voices = getChineseVoices();
  const saved = localStorage.getItem(VOICE_KEY);
  if (!voices.length) {
    select.innerHTML = '<option value="">系统默认中文音色</option>';
    select.disabled = true;
    return;
  }
  select.disabled = false;
  select.innerHTML = voices.map((voice, index) => `<option value="${escapeHtml(voice.voiceURI)}">${escapeHtml(voice.name)} · ${voiceRegion(voice.lang)}${voice.default ? '（默认）' : ''}</option>`).join('');
  const match = voices.find((voice) => voice.voiceURI === saved || voice.name === saved);
  select.value = (match || voices[0]).voiceURI;
}

function previewSelectedVoice() {
  const select = $('#voiceSelect');
  if (!select?.value || !('speechSynthesis' in window)) return;
  localStorage.setItem(VOICE_KEY, select.value);
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance('你好，我来陪圈圈认字');
  utterance.lang = 'zh-CN';
  utterance.rate = 0.82;
  utterance.pitch = 1.04;
  applySelectedVoice(utterance);
  window.speechSynthesis.speak(utterance);
}

function initVoiceSelector() {
  if (!('speechSynthesis' in window)) {
    $('#voiceSelect').innerHTML = '<option>当前浏览器不支持语音</option>';
    $('#voiceSelect').disabled = true;
    return;
  }
  refreshVoiceOptions();
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoiceOptions);
  setTimeout(refreshVoiceOptions, 500);
}

function reviewAgain() {
  if (!queue.length) return showView('homeView');
  queue = queue.map((queuedWord) => {
    const collection = queuedWord.source === 'textbook' ? textbookWords : words;
    return { ...(collection.find((word) => word.id === queuedWord.id) || queuedWord), source: queuedWord.source };
  });
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function reviewTodayAgain() {
  const reviewedChars = new Set((reviewLog[today()] || []).filter((entry) => !entry.source || entry.source === 'daily').map((entry) => entry.char));
  queue = words.filter((word) => reviewedChars.has(word.char));
  if (!queue.length) return showToast('今天还没有可重复复习的字');
  reviewContext = 'daily';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function returnFromReview() {
  const target = reviewContext === 'textbook' ? 'textbookView' : 'homeView';
  showView(target);
  if (target === 'textbookView') renderTextbook();
  else renderHome();
}

$('#todayLabel').textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
$('#openAdd').addEventListener('click', () => {
  if ($('#textbookView').classList.contains('active')) openTextbookDialog();
  else openAddDialog();
});
$('#openSettings').addEventListener('click', () => {
  refreshVoiceOptions();
  showDialog($('#settingsDialog'));
});
$('#closeSettings').addEventListener('click', () => closeDialog($('#settingsDialog')));
$('#previewVoice').addEventListener('click', previewSelectedVoice);
document.querySelectorAll('[data-review-mode]').forEach((button) => button.addEventListener('click', () => switchReviewMode(button.dataset.reviewMode)));
$('#reviewOverviewGrid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-overview-char]');
  if (button) speakGameText(button.dataset.overviewChar);
});
$('#pairModePanel').addEventListener('click', handlePairChoice);
$('#nextPairGroup').addEventListener('click', nextPairGroup);
$('#playListenWord').addEventListener('click', playListenTarget);
$('#listenChoices').addEventListener('click', handleListenChoice);
$('#emptyAdd').addEventListener('click', openAddDialog);
$('#addedTab').addEventListener('click', () => switchLibraryMode('added'));
$('#reviewedTab').addEventListener('click', () => switchLibraryMode('reviewed'));
$('#allDates').addEventListener('click', () => { libraryFilters[libraryMode] = 'all'; renderLibrary(); });
$('#libraryDate').addEventListener('change', (event) => { libraryFilters[libraryMode] = event.target.value || 'all'; renderLibrary(); });
$('#closeAdd').addEventListener('click', () => closeDialog($('#addDialog')));
$('#addForm').addEventListener('submit', addWords);
$('#startReview').addEventListener('click', startReview);
$('#exitReview').addEventListener('click', returnFromReview);
$('#wordCard').addEventListener('click', () => {
  const card = $('#wordCard');
  card.classList.toggle('revealed');
  $('#revealPrompt').textContent = card.classList.contains('revealed') ? '提示已经出现，再判断掌握程度' : '先自己读一读，再点卡片看提示';
});
$('#speakWord').addEventListener('click', speakCurrentWord);
$('#voiceSelect').addEventListener('change', previewSelectedVoice);
document.querySelectorAll('[data-rating]').forEach((button) => button.addEventListener('click', () => rateWord(Number(button.dataset.rating))));
$('#backHome').addEventListener('click', returnFromReview);
$('#reviewAgain').addEventListener('click', reviewAgain);
$('#homeReviewAgain').addEventListener('click', reviewTodayAgain);
$('#homeNav').addEventListener('click', () => { showView('homeView'); renderHome(); });
$('#textbookNav').addEventListener('click', () => { showView('textbookView'); renderTextbook(); });
$('#emptyTextbookAdd').addEventListener('click', () => openTextbookDialog());
$('#closeTextbook').addEventListener('click', () => closeDialog($('#textbookDialog')));
$('#textbookForm').addEventListener('submit', addTextbookWords);
$('#startTextbookReview').addEventListener('click', startTextbookReview);
$('#shuffleLessonReview').addEventListener('click', startShuffledLessonReview);
$('#toggleAllLessons').addEventListener('click', toggleAllVisibleLessons);
$('#textbookWordList').addEventListener('change', (event) => {
  const encodedKey = event.target.dataset.lessonSelect;
  if (!encodedKey) return;
  const key = decodeURIComponent(encodedKey);
  if (event.target.checked) selectedLessonKeys.add(key);
  else selectedLessonKeys.delete(key);
  updateLessonSelectionUI();
});
$('#textbookWordList').addEventListener('click', (event) => {
  const reviewButton = event.target.closest('[data-review-lesson]');
  const editButton = event.target.closest('[data-edit-lesson]');
  if (!reviewButton && !editButton) return;
  event.preventDefault();
  event.stopPropagation();
  if (reviewButton) startLessonReview(decodeURIComponent(reviewButton.dataset.reviewLesson));
  else openTextbookDialog(decodeURIComponent(editButton.dataset.editLesson));
});

let touchStartX = 0;
$('#wordCard').addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
$('#wordCard').addEventListener('touchend', (e) => {
  const distance = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 75) rateWord(distance > 0 ? 3 : 1);
}, { passive: true });

if ('serviceWorker' in navigator) {
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
  navigator.serviceWorker.register('./sw.js').then((registration) => registration.update()).catch(() => {});
}
navigator.storage?.persist?.().catch(() => {});
renderHome();
renderTextbook();
showView('textbookView');
loadRemoteTextbookCatalog();
initVoiceSelector();

