const STORAGE_KEY = 'zishiguang-words-v1';
const HISTORY_KEY = 'zishiguang-history-v1';
const REVIEW_LOG_KEY = 'zishiguang-review-log-v1';
const TEXTBOOK_KEY = 'zishiguang-textbook-v1';
const FAMILY_KEY = 'zishiguang-family-v1';
const CLOUD = window.CLOUD_CONFIG || {};

const $ = (selector) => document.querySelector(selector);
const today = () => new Date().toLocaleDateString('sv-SE');
const formatDate = (date) => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`));

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let queue = [];
let queueIndex = 0;
let reviewedCount = 0;
let familyId = localStorage.getItem(FAMILY_KEY) || '';
let syncTimer = null;
let isSyncing = false;
let reviewLog = JSON.parse(localStorage.getItem(REVIEW_LOG_KEY) || '{}');
let libraryMode = 'added';
let libraryFilters = { added: 'all', reviewed: today() };
let textbookWords = JSON.parse(localStorage.getItem(TEXTBOOK_KEY) || '[]');
let reviewContext = 'daily';

const supabaseBaseUrl = () => (CLOUD.url || '').trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/$/, '');
const cloudConfigured = () => /^https:\/\/.+\.supabase\.co$/i.test(supabaseBaseUrl()) && Boolean(CLOUD.publishableKey);
const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

function saveWords(sync = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  if (sync) scheduleCloudPush();
}

function saveHistory(history, sync = true) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([...new Set(history)]));
  if (sync) scheduleCloudPush();
}

function saveReviewLog(sync = true) {
  localStorage.setItem(REVIEW_LOG_KEY, JSON.stringify(reviewLog));
  if (sync) scheduleCloudPush();
}

function saveTextbookWords(sync = true) {
  localStorage.setItem(TEXTBOOK_KEY, JSON.stringify(textbookWords));
  if (sync) scheduleCloudPush();
}

function setCloudStatus(status, label) {
  const button = $('#openCloud');
  button.className = `cloud-button ${status}`;
  $('#cloudLabel').textContent = label;
}

function cloudHeaders(extra = {}) {
  return { apikey: CLOUD.publishableKey, Authorization: `Bearer ${CLOUD.publishableKey}`, 'x-family-id': familyId, ...extra };
}

async function hashFamilyCode(code) {
  const bytes = new TextEncoder().encode(`字时光-family-v1:${code.trim()}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function mergeWords(localWords, remoteWords) {
  const merged = new Map();
  [...remoteWords, ...localWords].forEach((word) => {
    const key = word.char;
    const existing = merged.get(key);
    const score = word.lastReviewed || word.updatedAt || word.createdAt || '';
    const existingScore = existing && (existing.lastReviewed || existing.updatedAt || existing.createdAt || '');
    if (!existing || score >= existingScore) merged.set(key, word);
  });
  return [...merged.values()];
}

function mergeReviewLogs(localLog, remoteLog) {
  const merged = {};
  const dates = new Set([...Object.keys(remoteLog || {}), ...Object.keys(localLog || {})]);
  dates.forEach((date) => {
    const byChar = new Map();
    [...(remoteLog?.[date] || []), ...(localLog?.[date] || [])].forEach((entry) => {
      const key = `${entry.source || 'daily'}-${entry.wordId || entry.char}`;
      const existing = byChar.get(key);
      if (!existing || (entry.reviewedAt || '') >= (existing.reviewedAt || '')) byChar.set(key, entry);
    });
    merged[date] = [...byChar.values()];
  });
  return merged;
}

function mergeTextbookWords(localWords, remoteWords) {
  const merged = new Map();
  [...remoteWords, ...localWords].forEach((word) => {
    const key = `${word.grade}-${word.semester}-${word.char}`;
    const existing = merged.get(key);
    const score = word.lastReviewed || word.updatedAt || word.createdAt || '';
    const existingScore = existing && (existing.lastReviewed || existing.updatedAt || existing.createdAt || '');
    if (!existing || score >= existingScore) merged.set(key, word);
  });
  return [...merged.values()];
}

async function pullAndMergeCloud(showMessage = false) {
  if (!cloudConfigured() || !familyId || isSyncing || !navigator.onLine) return;
  isSyncing = true;
  setCloudStatus('syncing', '同步中');
  try {
    const endpoint = `${supabaseBaseUrl()}/rest/v1/family_data?family_id=eq.${familyId}&select=payload`;
    const response = await fetch(endpoint, { headers: cloudHeaders() });
    if (!response.ok) throw new Error(`读取失败 (${response.status})`);
    const rows = await response.json();
    if (rows.length) {
      const payload = rows[0].payload || {};
      words = mergeWords(words, Array.isArray(payload.words) ? payload.words : []);
      reviewLog = mergeReviewLogs(reviewLog, payload.reviewLog || {});
      textbookWords = mergeTextbookWords(textbookWords, Array.isArray(payload.textbookWords) ? payload.textbookWords : []);
      saveWords(false);
      saveHistory([...getHistory(), ...(Array.isArray(payload.history) ? payload.history : [])], false);
      saveReviewLog(false);
      saveTextbookWords(false);
      renderHome();
      renderTextbook();
    }
    await pushCloudNow();
    if (showMessage) showToast('家庭字库已同步');
  } catch (error) {
    setCloudStatus('error', '同步失败');
    if (showMessage) showToast(error.message || '云端连接失败');
  } finally {
    isSyncing = false;
    if (familyId && $('#cloudLabel').textContent !== '同步失败') setCloudStatus('online', '已同步');
  }
}

async function pushCloudNow() {
  if (!cloudConfigured() || !familyId || !navigator.onLine) return;
  const endpoint = `${supabaseBaseUrl()}/rest/v1/family_data?on_conflict=family_id`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: cloudHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({ family_id: familyId, payload: { words, history: getHistory(), reviewLog, textbookWords, version: 3 }, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error(`保存失败 (${response.status})`);
}

function scheduleCloudPush() {
  if (!familyId || !cloudConfigured()) return;
  clearTimeout(syncTimer);
  setCloudStatus('syncing', '待同步');
  syncTimer = setTimeout(async () => {
    try {
      await pushCloudNow();
      setCloudStatus('online', '已同步');
    } catch (error) {
      setCloudStatus('error', '同步失败');
    }
  }, 700);
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
  const grade = $('#gradeFilter').value;
  const semester = $('#semesterFilter').value;
  return textbookWords.filter((word) => (grade === 'all' || String(word.grade) === grade) && (semester === 'all' || String(word.semester) === semester));
}

function renderTextbook() {
  const filtered = getFilteredTextbookWords();
  $('#textbookTotal').textContent = textbookWords.length;
  $('#filteredTextbookCount').textContent = filtered.length;
  $('#knownTextbookCount').textContent = filtered.filter((word) => word.level === 3).length;
  $('#startTextbookReview').disabled = filtered.length === 0;
  $('#emptyTextbook').classList.toggle('show', filtered.length === 0);
  const groups = {};
  filtered.forEach((word) => {
    const key = `${word.grade}-${word.semester}`;
    (groups[key] ||= []).push(word);
  });
  $('#textbookWordList').innerHTML = Object.keys(groups).sort().map((key) => {
    const entries = groups[key];
    const first = entries[0];
    const tiles = entries.slice().sort((a, b) => (a.unit || '').localeCompare(b.unit || '', 'zh-CN') || a.char.localeCompare(b.char, 'zh-CN')).map((word) => `<button class="word-tile level-${word.level || 0}" data-textbook-id="${word.id}" aria-label="${word.char}，${levelText(word.level)}">
      <span class="level-dot"></span><b>${word.char}</b><small>${word.unit || levelText(word.level)}</small>
    </button>`).join('');
    return `<section class="textbook-group"><div class="textbook-group-head"><h3>${gradeText(first.grade)} · ${semesterText(first.semester)}</h3><span>${entries.length} 个字</span></div><div class="word-list">${tiles}</div></section>`;
  }).join('');
}

function openTextbookDialog() {
  const grade = $('#gradeFilter').value;
  const semester = $('#semesterFilter').value;
  if (grade !== 'all') $('#textbookGrade').value = grade;
  if (semester !== 'all') $('#textbookSemester').value = semester;
  $('#textbookDialog').showModal();
  setTimeout(() => $('#textbookInput').focus(), 100);
}

function addTextbookWords(event) {
  event.preventDefault();
  const chars = [...new Set([...$('#textbookInput').value].filter((char) => /[\u3400-\u9fff]/.test(char)))];
  if (!chars.length) return showToast('请输入至少一个汉字');
  const grade = Number($('#textbookGrade').value);
  const semester = Number($('#textbookSemester').value);
  const unit = $('#textbookUnit').value.trim();
  let added = 0;
  chars.forEach((char, index) => {
    if (textbookWords.some((word) => word.char === char && word.grade === grade && word.semester === semester)) return;
    textbookWords.push({ id: `tb-${Date.now()}-${index}-${char}`, char, grade, semester, unit, level: 0, reviewCount: 0, createdAt: today(), source: 'textbook' });
    added += 1;
  });
  saveTextbookWords();
  $('#gradeFilter').value = String(grade);
  $('#semesterFilter').value = String(semester);
  renderTextbook();
  $('#textbookDialog').close();
  $('#textbookForm').reset();
  showToast(added ? `已录入 ${added} 个课本生字` : '这些字已在本册识字表中');
}

function startTextbookReview() {
  queue = getFilteredTextbookWords().map((word) => ({ ...word, source: 'textbook' }));
  if (!queue.length) return;
  reviewContext = 'textbook';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
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
  $('#addDialog').showModal();
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
  $('#addDialog').close();
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
  const chineseVoice = window.speechSynthesis.getVoices().find((voice) => /^zh[-_]/i.test(voice.lang));
  if (chineseVoice) utterance.voice = chineseVoice;
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
  const chineseVoice = window.speechSynthesis.getVoices().find((voice) => /^zh[-_]/i.test(voice.lang));
  if (chineseVoice) utterance.voice = chineseVoice;
  window.speechSynthesis.speak(utterance);
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

function openCloudDialog() {
  const connected = Boolean(familyId);
  $('#familyCode').value = '';
  $('#familyCode').disabled = connected;
  $('#connectCloud').style.display = connected ? 'none' : 'flex';
  $('#disconnectCloud').classList.toggle('show', connected);
  $('#cloudConfigNote').textContent = cloudConfigured()
    ? (connected ? '当前设备已连接家庭字库。口令原文没有保存在设备或云端。' : '首次连接会合并本机记录与云端记录。')
    : '云端尚未配置。请先按 CLOUD_SETUP.md 完成一次数据库连接。';
  $('#cloudDialog').showModal();
  if (!connected && cloudConfigured()) setTimeout(() => $('#familyCode').focus(), 100);
}

async function connectFamily(event) {
  event.preventDefault();
  if (!cloudConfigured()) return showToast('请先完成云端配置');
  const code = $('#familyCode').value.trim();
  if (code.length < 8) return showToast('家庭口令至少需要 8 位');
  $('#connectCloud').disabled = true;
  $('#connectCloud').textContent = '正在连接…';
  familyId = await hashFamilyCode(code);
  localStorage.setItem(FAMILY_KEY, familyId);
  await pullAndMergeCloud(true);
  $('#connectCloud').disabled = false;
  $('#connectCloud').textContent = '连接并同步';
  if ($('#cloudLabel').textContent === '已同步') $('#cloudDialog').close();
}

function disconnectFamily() {
  if (!confirm('断开后本机记录会保留，但不再与家庭同步。确定断开吗？')) return;
  familyId = '';
  localStorage.removeItem(FAMILY_KEY);
  setCloudStatus('', cloudConfigured() ? '未连接' : '本地');
  $('#cloudDialog').close();
  showToast('已断开，手机上的记录仍保留');
}

$('#todayLabel').textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
$('#openAdd').addEventListener('click', openAddDialog);
$('#openCloud').addEventListener('click', openCloudDialog);
$('#closeCloud').addEventListener('click', () => $('#cloudDialog').close());
$('#cloudForm').addEventListener('submit', connectFamily);
$('#disconnectCloud').addEventListener('click', disconnectFamily);
$('#emptyAdd').addEventListener('click', openAddDialog);
$('#addedTab').addEventListener('click', () => switchLibraryMode('added'));
$('#reviewedTab').addEventListener('click', () => switchLibraryMode('reviewed'));
$('#allDates').addEventListener('click', () => { libraryFilters[libraryMode] = 'all'; renderLibrary(); });
$('#libraryDate').addEventListener('change', (event) => { libraryFilters[libraryMode] = event.target.value || 'all'; renderLibrary(); });
$('#closeAdd').addEventListener('click', () => $('#addDialog').close());
$('#addForm').addEventListener('submit', addWords);
$('#startReview').addEventListener('click', startReview);
$('#exitReview').addEventListener('click', returnFromReview);
$('#wordCard').addEventListener('click', () => $('#wordCard').classList.toggle('revealed'));
$('#speakWord').addEventListener('click', speakCurrentWord);
document.querySelectorAll('[data-rating]').forEach((button) => button.addEventListener('click', () => rateWord(Number(button.dataset.rating))));
$('#backHome').addEventListener('click', returnFromReview);
$('#reviewAgain').addEventListener('click', reviewAgain);
$('#homeReviewAgain').addEventListener('click', reviewTodayAgain);
$('#homeNav').addEventListener('click', () => { showView('homeView'); renderHome(); });
$('#textbookNav').addEventListener('click', () => { showView('textbookView'); renderTextbook(); });
$('#gradeFilter').addEventListener('change', renderTextbook);
$('#semesterFilter').addEventListener('change', renderTextbook);
$('#addTextbook').addEventListener('click', openTextbookDialog);
$('#emptyTextbookAdd').addEventListener('click', openTextbookDialog);
$('#closeTextbook').addEventListener('click', () => $('#textbookDialog').close());
$('#textbookForm').addEventListener('submit', addTextbookWords);
$('#startTextbookReview').addEventListener('click', startTextbookReview);

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
window.addEventListener('online', () => pullAndMergeCloud());
document.addEventListener('visibilitychange', () => { if (!document.hidden) pullAndMergeCloud(); });
setCloudStatus(familyId && cloudConfigured() ? 'online' : '', familyId && cloudConfigured() ? '云同步' : (cloudConfigured() ? '未连接' : '本地'));
renderHome();
renderTextbook();
if (familyId && cloudConfigured()) pullAndMergeCloud();
