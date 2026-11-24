const STORAGE_KEY = 'zishiguang-words-v1';
const HISTORY_KEY = 'zishiguang-history-v1';
const REVIEW_LOG_KEY = 'zishiguang-review-log-v1';
const TEXTBOOK_KEY = 'zishiguang-textbook-v1';
const TEXTBOOK_CATALOG_ID = 'textbook-catalog-v1';
const TEXTBOOK_OVERRIDES_KEY = 'zishiguang-textbook-overrides-v1';
const TEXTBOOK_STATUS_DIRTY_KEY = 'zishiguang-textbook-status-dirty-v1';
const VOICE_KEY = 'zishiguang-voice-v1';
const SPEAK_WORD_EXAMPLE_KEY = 'zishiguang-speak-word-example-v1';
const VOLCANO_ANIMATION_KEY = 'zishiguang-volcano-animation-v1';
const MANUAL_WORDS_KEY = 'zishiguang-manual-words-v1';
const OVERVIEW_PINYIN_KEY = 'zishiguang-overview-pinyin-hidden-v1';
const SENTENCES_KEY = 'zishiguang-study-sentences-v1';
const STUDY_CONTENT_META_KEY = 'zishiguang-study-content-meta-v1';
const FEEDBACK_AUDIO_FILES = {
  'Bingo': './assets/voice-pack/bingo.mp3',
  '圈圈，你真是太棒了': './assets/voice-pack/known.mp3',
  '很好，圈圈，下次就认识了': './assets/voice-pack/familiar.mp3',
  '圈圈，你要加油哦，我相信你': './assets/voice-pack/again.mp3'
};
const WORD_FALLBACKS = {
  哥:['哥哥','大哥'],鸦:['乌鸦','鸦片'],蛙:['青蛙','牛蛙'],狗:['小狗','狼狗'],伞:['雨伞','打伞'],兔:['白兔','兔子'],爪:['爪子','鸡爪'],霜:['冰霜','霜花'],弓:['弓箭','拉弓'],吴:['吴国'],页:['页面','书页'],粽:['粽子','粽叶'],煮:['煮饭','煮熟'],蚂:['蚂蚁'],蚁:['蚂蚁','白蚁'],杨:['杨树','白杨'],袍:['长袍','棉袍'],呀:['好呀'],吗:['好吗'],吧:['走吧'],汤:['米汤','菜汤'],蚊:['蚊子','蚊虫'],啊:['好啊'],猴:['猴子','金丝猴'],掰:['掰开'],扛:['扛起','扛枪'],棵:['一棵','棵数'],咕:['咕咚','咕噜'],咚:['咕咚','叮咚'],啦:['来啦'],鹿:['小鹿','梅花鹿'],龟:['乌龟','海龟'],肚:['肚子','肚皮'],帆:['帆船','风帆'],艘:['一艘'],溪:['小溪','溪水'],榕:['榕树'],桐:['梧桐','油桐'],枫:['枫树','枫叶'],桦:['白桦','桦树'],杏:['杏花','杏子'],杉:['水杉','杉树'],蝴:['蝴蝶'],蝶:['蝴蝶','彩蝶'],壶:['水壶','茶壶'],鼻:['鼻子','鼻孔'],勺:['勺子','饭勺'],琴:['钢琴','琴声'],鹊:['喜鹊'],盯:['盯着','盯住'],朱:['朱红','朱砂'],扁:['扁担','扁平'],踩:['踩水','踩踏'],刘:['姓刘'],炒:['炒菜','炒饭'],哎:['哎呀'],哇:['好哇'],晒:['晒太阳','晾晒'],漱:['漱口'],沼:['沼泽'],闸:['水闸','闸门'],羔:['羊羔'],蝗:['蝗虫'],猬:['刺猬'],莓:['草莓'],呜:['呜咽','呜呜'],猩:['猩猩'],鸽:['鸽子','白鸽'],蚯:['蚯蚓'],蚓:['蚯蚓'],骆:['骆驼'],驼:['骆驼','驼峰'],狮:['狮子','海狮'],莺:['黄莺','夜莺'],咏:['歌咏','咏叹'],绦:['丝绦'],袄:['棉袄','夹袄'],鹃:['杜鹃'],籽:['种子','菜籽'],亭:['凉亭','亭子'],瓣:['花瓣','蒜瓣'],蔗:['甘蔗','蔗糖'],葱:['大葱','葱花'],巷:['小巷','街巷'],祭:['祭祖','祭扫'],艾:['艾草'],菊:['菊花'],菠:['菠菜','菠萝'],茄:['茄子','番茄'],炖:['炖肉','炖汤'],蘑:['蘑菇'],菇:['蘑菇','香菇'],饺:['饺子','水饺'],酱:['酱油','果酱'],茸:['毛茸茸','鹿茸'],屎:['眼屎','鸟屎'],婶:['婶婶','大婶'],陀:['陀螺'],螺:['田螺','海螺'],毽:['毽子','踢毽子'],叼:['叼走','叼着'],晌:['晌午','半晌'],棚:['大棚','车棚'],驮:['驮运','驮着'],哩:['好哩'],唉:['唉声叹气'],蹄:['马蹄','蹄子'],鹂:['黄鹂'],盏:['一盏','灯盏'],耷:['耷拉'],咦:['咦呀'],竿:['竹竿','鱼竿'],颈:['颈部','长颈鹿'],袜:['袜子','棉袜'],蜈:['蜈蚣'],蚣:['蜈蚣'],愣:['发愣','愣住'],帚:['扫帚'],桶:['水桶','木桶'],箕:['簸箕'],蔷:['蔷薇'],薇:['蔷薇'],哦:['哦呀'],
  行:['行走','步行','行动'],长:['长江','长城','长短'],只:['一只','船只'],乐:['快乐','欢乐','乐园'],得:['得到','获得'],地:['大地','土地','地方'],着:['看着','听着'],还:['还有','还是'],重:['重要','重量'],朝:['朝向','朝代'],发:['发现','出发'],好:['好人','美好'],少:['多少','很少'],数:['数学','数字'],空:['天空','空气'],更:['更加','更好'],没:['没有','没事'],几:['几个','几天'],觉:['觉得','感觉'],背:['背后','后背'],当:['当时','当天'],种:['种子','种类']
};

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
let textbookOverrides = JSON.parse(localStorage.getItem(TEXTBOOK_OVERRIDES_KEY) || '{}');
let reviewContext = 'daily';
let reviewScope = 'all';
let selectedLessonKeys = new Set();
let editingLessonKey = null;
let pendingOpenLessonKey = null;
let pairGroupIndex = 0;
let selectedPairChar = null;
let listenTarget = null;
let listenScore = 0;
let manualStudyWords = JSON.parse(localStorage.getItem(MANUAL_WORDS_KEY) || '{}');
let overviewPinyinHidden = localStorage.getItem(OVERVIEW_PINYIN_KEY) === 'true';
let studySentences = JSON.parse(localStorage.getItem(SENTENCES_KEY) || '[]');
let studyContentMeta = JSON.parse(localStorage.getItem(STUDY_CONTENT_META_KEY) || '{"wordGroups":{},"deletedSentences":{}}');
studyContentMeta.wordGroups ||= {};
studyContentMeta.deletedSentences ||= {};
let speakWordExample = localStorage.getItem(SPEAK_WORD_EXAMPLE_KEY) === 'true';
let volcanoAnimationEnabled = localStorage.getItem(VOLCANO_ANIMATION_KEY) !== 'false';
let sentenceRound = null;
let sentenceAnswer = [];
let pendingStatusWordIds = [];
let pendingStatusLabel = '';
let textbookStatusSyncPromise = null;
let studySyncRevision = 0;
let activeFeedbackAudio = null;

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

function setStatusSyncState(text, mode = '') {
  const element = $('#statusSyncState');
  if (!element) return;
  element.textContent = text;
  element.dataset.mode = mode;
}

function textbookStatusTimestamp(word) {
  if (word.statusUpdatedAt) return word.statusUpdatedAt;
  if (word.lastReviewed) return `${word.lastReviewed}T12:00:00.000Z`;
  return word.level ? `${word.createdAt || '2000-01-01'}T00:00:00.000Z` : '';
}

function localTextbookStatusSnapshot() {
  return Object.fromEntries(textbookWords
    .filter((word) => word.statusUpdatedAt || word.level)
    .map((word) => [word.id, { level: Number(word.level || 0), updatedAt: textbookStatusTimestamp(word) }]));
}

function saveStudyContentMeta() {
  localStorage.setItem(STUDY_CONTENT_META_KEY, JSON.stringify(studyContentMeta));
}

function localWordGroupSnapshot() {
  const chars = new Set([...Object.keys(manualStudyWords), ...Object.keys(studyContentMeta.wordGroups)]);
  return Object.fromEntries([...chars].map((char) => [char, {
    words: manualStudyWords[char] || [],
    updatedAt: studyContentMeta.wordGroups[char]?.updatedAt || '2000-01-01T00:00:00.000Z'
  }]));
}

function localSentenceSnapshot() {
  return Object.fromEntries(studySentences.map((item) => [item.id, {
    ...item,
    updatedAt: item.updatedAt || item.createdAt || '2000-01-01T00:00:00.000Z'
  }]));
}

function mergeTimedRecords(remote = {}, local = {}) {
  const merged = { ...remote };
  Object.entries(local).forEach(([id, entry]) => {
    const remoteEntry = remote[id];
    if (!remoteEntry || String(entry.updatedAt || '') >= String(remoteEntry.updatedAt || '')) merged[id] = entry;
  });
  return merged;
}

function markTextbookStatusDirty() {
  studySyncRevision += 1;
  localStorage.setItem(TEXTBOOK_STATUS_DIRTY_KEY, 'true');
  setStatusSyncState(navigator.onLine ? '等待同步' : '离线保存', navigator.onLine ? 'pending' : 'offline');
  clearTimeout(markTextbookStatusDirty.timer);
  markTextbookStatusDirty.timer = setTimeout(syncTextbookStatuses, 700);
}

async function syncTextbookStatuses() {
  if (textbookStatusSyncPromise) return textbookStatusSyncPromise;
  const config = window.CLOUD_CONFIG;
  const progressId = config?.textbookProgressId;
  if (!config?.url || !config?.publishableKey || !progressId) {
    setStatusSyncState('云端未配置', 'offline');
    return;
  }
  if (!navigator.onLine) {
    setStatusSyncState('离线保存', 'offline');
    return;
  }
  const revisionAtStart = studySyncRevision;
  textbookStatusSyncPromise = (async () => {
    setStatusSyncState('同步中…', 'syncing');
    const headers = { apikey: config.publishableKey, 'x-family-id': progressId, 'Content-Type': 'application/json' };
    const readUrl = `${config.url}/rest/v1/family_data?family_id=eq.${encodeURIComponent(progressId)}&select=payload`;
    const readResponse = await fetch(readUrl, { headers, cache: 'no-store' });
    if (!readResponse.ok) throw new Error(`status read ${readResponse.status}`);
    const rows = await readResponse.json();
    const remotePayload = rows[0]?.payload || {};
    const mergedStatuses = mergeTimedRecords(remotePayload.statuses, localTextbookStatusSnapshot());
    const mergedWordGroups = mergeTimedRecords(remotePayload.wordGroups, localWordGroupSnapshot());
    const mergedSentences = mergeTimedRecords(remotePayload.sentences, localSentenceSnapshot());
    const mergedDeletedSentences = { ...(remotePayload.deletedSentences || {}) };
    Object.entries(studyContentMeta.deletedSentences).forEach(([id, deletedAt]) => {
      if (String(deletedAt) >= String(mergedDeletedSentences[id] || '')) mergedDeletedSentences[id] = deletedAt;
    });
    let localChanged = false;
    textbookWords.forEach((word) => {
      const remote = mergedStatuses[word.id];
      if (!remote) return;
      const localTime = textbookStatusTimestamp(word);
      if (String(remote.updatedAt || '') > String(localTime || '')) {
        word.level = Number(remote.level || 0);
        word.statusUpdatedAt = remote.updatedAt;
        localChanged = true;
      }
    });
    if (localChanged) {
      saveTextbookWords();
      renderTextbook();
    }
    let contentChanged = false;
    Object.entries(mergedWordGroups).forEach(([char, entry]) => {
      const localTime = studyContentMeta.wordGroups[char]?.updatedAt || '';
      if (String(entry.updatedAt || '') <= String(localTime)) return;
      if (Array.isArray(entry.words) && entry.words.length) manualStudyWords[char] = entry.words;
      else delete manualStudyWords[char];
      studyContentMeta.wordGroups[char] = { updatedAt: entry.updatedAt };
      contentChanged = true;
    });
    Object.entries(mergedDeletedSentences).forEach(([id, deletedAt]) => {
      if (String(deletedAt) > String(studyContentMeta.deletedSentences[id] || '')) {
        studyContentMeta.deletedSentences[id] = deletedAt;
        contentChanged = true;
      }
    });
    const visibleSentences = Object.values(mergedSentences)
      .filter((item) => String(mergedDeletedSentences[item.id] || '') < String(item.updatedAt || item.createdAt || ''))
      .sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
    if (JSON.stringify(visibleSentences) !== JSON.stringify(studySentences)) {
      studySentences = visibleSentences;
      contentChanged = true;
    }
    if (contentChanged) {
      localStorage.setItem(MANUAL_WORDS_KEY, JSON.stringify(manualStudyWords));
      localStorage.setItem(SENTENCES_KEY, JSON.stringify(studySentences));
      saveStudyContentMeta();
      if ($('#reviewView').classList.contains('active')) renderReviewOverview();
    }
    const writeResponse = await fetch(`${config.url}/rest/v1/family_data?on_conflict=family_id`, {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ family_id: progressId, payload: { version: 2, statuses: mergedStatuses, wordGroups: mergedWordGroups, sentences: mergedSentences, deletedSentences: mergedDeletedSentences } })
    });
    if (!writeResponse.ok) throw new Error(`status write ${writeResponse.status}`);
    if (revisionAtStart === studySyncRevision) localStorage.setItem(TEXTBOOK_STATUS_DIRTY_KEY, 'false');
    setStatusSyncState('已同步', 'synced');
  })().catch((error) => {
    console.warn('掌握状态同步失败，已保存在本机。', error);
    setStatusSyncState(navigator.onLine ? '同步待重试' : '离线保存', navigator.onLine ? 'pending' : 'offline');
  }).finally(() => {
    textbookStatusSyncPromise = null;
    if (revisionAtStart !== studySyncRevision) markTextbookStatusDirty.timer = setTimeout(syncTextbookStatuses, 300);
  });
  return textbookStatusSyncPromise;
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
    textbookWords = applyTextbookOverrides([...manualWords, ...remoteWords]);
    saveTextbookWords();
    renderTextbook();
  } catch (error) {
    console.warn('课本字表同步失败，将继续使用本机数据。', error);
  } finally {
    syncTextbookStatuses();
  }
}

function applyTextbookOverrides(baseWords) {
  let result = baseWords.slice();
  Object.entries(textbookOverrides).forEach(([sourceKey, override]) => {
    if (!override || !Array.isArray(override.chars)) return;
    const currentKey = override.currentKey || `${override.grade}|${override.semester}|${override.unit}`;
    const previousEntries = textbookWords.filter((word) => {
      const key = lessonKey(word);
      return key === sourceKey || key === currentKey;
    });
    const previousByChar = new Map(previousEntries.map((word) => [word.char, word]));
    result = result.filter((word) => {
      const key = lessonKey(word);
      return key !== sourceKey && key !== currentKey;
    });
    override.chars.forEach((char, index) => {
      const previous = previousByChar.get(char);
      result.push({
        ...previous,
        id: previous?.id || `override-${override.grade}-${override.semester}-${override.lessonOrder || 9999}-${index}-${char}`,
        char,
        grade: Number(override.grade),
        semester: Number(override.semester),
        bookUnit: override.bookUnit || previous?.bookUnit || '自定义课时',
        unit: override.unit,
        lessonOrder: Number(override.lessonOrder || previous?.lessonOrder || 9999),
        charOrder: index,
        level: previous?.level || 0,
        reviewCount: previous?.reviewCount || 0,
        createdAt: previous?.createdAt || today(),
        source: 'textbook',
        catalog: true,
        localOverride: true
      });
    });
  });
  return result;
}

function levelText(level) {
  return ['未认识', '重点复习', '有点熟', '已认识'][level || 0];
}

function showView(id) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === id));
  const isMainView = id === 'homeView' || id === 'textbookView';
  $('.topbar').style.display = isMainView ? 'flex' : 'none';
  $('.hero').style.display = id === 'homeView' ? 'flex' : 'none';
  $('#mainNav').style.display = isMainView ? 'grid' : 'none';
  $('#pugRunner').classList.toggle('active', isMainView);
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
  $('#selectedStatusButton').disabled = selectedCount === 0;
  $('#toggleAllLessons').textContent = visibleKeys.length && visibleKeys.every((key) => selectedLessonKeys.has(key)) ? '取消全选' : '全选课时';
}

function renderTextbook() {
  const openKeys = new Set([...document.querySelectorAll('#textbookWordList details[open][data-open-key]')].map((details) => details.dataset.openKey));
  const filtered = sortTextbookWords(getFilteredTextbookWords());
  $('#textbookTotal').textContent = textbookWords.length;
  $('#filteredTextbookCount').textContent = filtered.length;
  $('#knownTextbookCount').textContent = filtered.filter((word) => word.level === 3).length;
  $('#focusTextbookCount').textContent = filtered.filter((word) => word.level === 1).length;
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
    const bookKey = `${book.grade}-${book.semester}`;
    const bookOpenKey = `book:${bookKey}`;
    const allLessons = [...book.units.values()].flatMap((lessons) => [...lessons.values()]);
    const bookCount = allLessons.reduce((sum, entries) => sum + entries.length, 0);
    const lessonCount = allLessons.length;
    const unitsHtml = [...book.units.entries()].map(([unitName, lessons]) => {
      const unitOpenKey = `unit:${bookKey}:${unitName}`;
      const unitCount = [...lessons.values()].reduce((sum, entries) => sum + entries.length, 0);
      const lessonsHtml = [...lessons.entries()].map(([key, entries]) => {
        const lessonOpenKey = `lesson:${key}`;
        const encodedKey = encodeURIComponent(key);
        const lessonName = entries[0].unit || '未分课时';
        const tiles = entries.map((word) => `<button class="word-tile level-${word.level || 0}" data-textbook-id="${word.id}" aria-label="${word.char}，${levelText(word.level)}">
          <span class="level-dot"></span><b>${word.char}</b><small>${levelText(word.level)}</small>
        </button>`).join('');
        return `<details class="lesson-card" data-open-key="${escapeHtml(lessonOpenKey)}" ${openKeys.has(lessonOpenKey) || pendingOpenLessonKey === key ? 'open' : ''}><summary class="lesson-card-head"><div><h4>${escapeHtml(lessonName)}</h4><small>${entries.length} 个字</small></div><div class="lesson-actions"><button class="lesson-review-button" type="button" data-review-lesson="${encodedKey}">复习</button><button type="button" data-status-lesson="${encodedKey}">状态</button><button type="button" data-edit-lesson="${encodedKey}">编辑</button></div><span class="lesson-toggle"></span></summary><div class="lesson-select-row"><label class="lesson-checkbox"><input type="checkbox" data-lesson-select="${encodedKey}" ${selectedLessonKeys.has(key) ? 'checked' : ''}><span></span></label><b>选择此课时参加乱序复习</b></div><div class="word-list">${tiles}</div></details>`;
      }).join('');
      const unitStatusKey = encodeURIComponent(JSON.stringify([String(book.grade), String(book.semester), unitName]));
      return `<details class="textbook-unit" data-open-key="${escapeHtml(unitOpenKey)}" ${openKeys.has(unitOpenKey) ? 'open' : ''}><summary class="textbook-unit-head"><h4>${escapeHtml(unitName)}</h4><div class="hierarchy-summary"><span>${lessons.size} 个课时 · ${unitCount} 个字</span><button type="button" data-status-unit="${unitStatusKey}">批量状态</button></div><i class="hierarchy-toggle"></i></summary><div class="textbook-unit-body">${lessonsHtml}</div></details>`;
    }).join('');
    return `<details class="textbook-group" data-open-key="${escapeHtml(bookOpenKey)}" ${openKeys.has(bookOpenKey) ? 'open' : ''}><summary class="textbook-group-head"><h3>${gradeText(book.grade)}${semesterText(book.semester)}</h3><div class="hierarchy-summary"><span>${book.units.size} 个单元 · ${lessonCount} 个课时 · ${bookCount} 个字</span><button type="button" data-status-book="${encodeURIComponent(bookKey)}">批量状态</button></div><i class="hierarchy-toggle"></i></summary><div class="textbook-group-body">${unitsHtml}</div></details>`;
  }).join('');
  pendingOpenLessonKey = null;
  updateLessonSelectionUI();
}

function openTextbookStatusDialog(ids, label) {
  pendingStatusWordIds = [...new Set(ids)].filter((id) => textbookWords.some((word) => word.id === id));
  pendingStatusLabel = label;
  if (!pendingStatusWordIds.length) return showToast('当前范围没有可设置的汉字');
  $('#statusDialogTitle').textContent = pendingStatusWordIds.length === 1 ? '设置这个字的状态' : '批量设置识字状态';
  $('#statusScopeText').textContent = `${pendingStatusLabel} · 共 ${pendingStatusWordIds.length} 个字`;
  showDialog($('#textbookStatusDialog'));
}

function applyTextbookStatus(level) {
  const ids = new Set(pendingStatusWordIds);
  let changed = 0;
  textbookWords.forEach((word) => {
    if (!ids.has(word.id)) return;
    word.level = level;
    word.statusUpdatedAt = new Date().toISOString();
    changed += 1;
  });
  if (!changed) return showToast('没有找到要修改的汉字');
  saveTextbookWords();
  markTextbookStatusDirty();
  closeDialog($('#textbookStatusDialog'));
  renderTextbook();
  showToast(`${pendingStatusLabel}：${changed} 个字已设为${levelText(level)}`);
}

function openSelectedLessonsStatus() {
  const ids = textbookWords.filter((word) => selectedLessonKeys.has(lessonKey(word))).map((word) => word.id);
  openTextbookStatusDialog(ids, `已选 ${selectedLessonKeys.size} 个课时`);
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
    const entries = sortTextbookWords(textbookWords.filter((word) => lessonKey(word) === key));
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
    const oldEntries = sortTextbookWords(textbookWords.filter((word) => lessonKey(word) === editingLessonKey));
    const first = oldEntries[0];
    const oldIds = new Set(oldEntries.map((word) => word.id));
    const oldByChar = new Map(oldEntries.map((word) => [word.char, word]));
    const newKey = `${grade}|${semester}|${unit}`;
    const lessonWasOpen = [...document.querySelectorAll('#textbookWordList details.lesson-card[open]')].some((details) => details.dataset.openKey === `lesson:${editingLessonKey}`);
    const wasSelected = selectedLessonKeys.delete(editingLessonKey);
    const replacement = chars.map((char, index) => {
      const previous = oldByChar.get(char);
      return {
        ...previous,
        id: previous?.id || `tb-${Date.now()}-${index}-${char}`,
        char,
        grade,
        semester,
        bookUnit: first?.bookUnit || previous?.bookUnit || '自定义课时',
        unit,
        lessonOrder: Number(first?.lessonOrder || previous?.lessonOrder || 9999),
        charOrder: index,
        level: previous?.level || 0,
        reviewCount: previous?.reviewCount || 0,
        createdAt: previous?.createdAt || today(),
        source: 'textbook',
        localOverride: true
      };
    });
    textbookWords = [...textbookWords.filter((word) => !oldIds.has(word.id)), ...replacement];
    const existingOverride = Object.entries(textbookOverrides).find(([sourceKey, override]) => sourceKey === editingLessonKey || override?.currentKey === editingLessonKey);
    const overrideSourceKey = existingOverride?.[0] || editingLessonKey;
    if (existingOverride) delete textbookOverrides[existingOverride[0]];
    textbookOverrides[overrideSourceKey] = {
      currentKey: newKey,
      grade,
      semester,
      bookUnit: first?.bookUnit || '自定义课时',
      unit,
      lessonOrder: Number(first?.lessonOrder || 9999),
      chars
    };
    localStorage.setItem(TEXTBOOK_OVERRIDES_KEY, JSON.stringify(textbookOverrides));
    if (wasSelected) selectedLessonKeys.add(newKey);
    saveTextbookWords();
    if (lessonWasOpen) pendingOpenLessonKey = newKey;
    editingLessonKey = null;
    renderTextbook();
    closeDialog($('#textbookDialog'));
    showToast('课时已按输入顺序全量保存');
    return;
  }
  const existingOrders = textbookWords.filter((word) => word.grade === grade && word.semester === semester).map((word) => Number(word.lessonOrder || 0));
  const lessonOrder = Math.max(0, ...existingOrders) + 1;
  chars.forEach((char, index) => {
    textbookWords.push({ id: `tb-${Date.now()}-${index}-${char}`, char, grade, semester, bookUnit: '自定义课时', unit, lessonOrder, charOrder: index, level: 0, reviewCount: 0, createdAt: today(), source: 'textbook' });
  });
  saveTextbookWords();
  renderTextbook();
  closeDialog($('#textbookDialog'));
  $('#textbookForm').reset();
  showToast(`已按输入顺序录入 ${chars.length} 个课本生字`);
}

function startTextbookReview() {
  queue = sortTextbookWords(getFilteredTextbookWords()).map((word) => ({ ...word, source: 'textbook' }));
  if (!queue.length) return;
  reviewContext = 'textbook';
  reviewScope = 'all';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function startLessonReview(key) {
  queue = sortTextbookWords(textbookWords.filter((word) => lessonKey(word) === key)).map((word) => ({ ...word, source: 'textbook' }));
  if (!queue.length) return showToast('这个课时还没有生字');
  reviewContext = 'textbook';
  reviewScope = 'lesson';
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
  reviewScope = 'combined';
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
  reviewScope = 'all';
  queueIndex = 0;
  reviewedCount = 0;
  showView('reviewView');
  renderCard();
}

function renderCard({ preserveMode = false } = {}) {
  const word = queue[queueIndex];
  const card = $('#wordCard');
  card.className = 'word-card enter';
  $('#reviewWord').textContent = word.char;
  const studyWords = getStudyWords(word);
  $('#memoryCue').innerHTML = `<strong>${escapeHtml(getPinyin(word.char))}</strong><span>${studyWords.map(escapeHtml).join(' · ') || '大声读一读'}</span>${word.note ? `<small>${escapeHtml(word.note)}</small>` : ''}`;
  $('#reviewDate').textContent = word.source === 'textbook'
    ? `${gradeText(word.grade)}${semesterText(word.semester)}${word.unit ? ` · ${word.unit}` : ''}`
    : `${formatDate(word.createdAt)}认识`;
  $('#reviewProgress').textContent = `${queueIndex + 1} / ${queue.length}`;
  $('#progressBar').style.width = `${(queueIndex / queue.length) * 100}%`;
  $('#reviewedCountDisplay').textContent = reviewedCount;
  $('#remainingCount').textContent = queue.length - queueIndex;
  $('#shuffleCurrentLesson').hidden = reviewScope !== 'lesson' || queue.length < 2 || reviewedCount > 0;
  $('#revealPrompt').textContent = '先自己读一读，再点卡片听读音和看提示';
  if (queueIndex === 0 && !preserveMode) prepareReviewModes();
}

function getPinyin(char) {
  try {
    return window.pinyinPro?.pinyin(char, { toneType: 'symbol' }) || '—';
  } catch (error) {
    return '—';
  }
}

function getAutomaticStudyWords(wordOrChar) {
  const char = typeof wordOrChar === 'string' ? wordOrChar : wordOrChar.char;
  const fallback = WORD_FALLBACKS[char] || [];
  let candidates = [];
  try {
    candidates = typeof window.cnchar?.words === 'function' ? window.cnchar.words(char) : [];
  } catch (error) {
    candidates = [];
  }
  const targetPinyin = getPinyin(char);
  const normalized = (value) => String(value).replace(/\s+/g, '').toLowerCase();
  const matching = candidates.filter((term) => {
    if (!term || term.length < 2 || term.length > 4 || !term.includes(char)) return false;
    try {
      const readings = window.pinyinPro?.pinyin(term, { type: 'array', toneType: 'symbol' });
      const index = [...term].indexOf(char);
      return Array.isArray(readings) && normalized(readings[index]) === normalized(targetPinyin);
    } catch (error) {
      return true;
    }
  });
  const ranked = [...fallback, ...matching].filter((term, index, all) => all.indexOf(term) === index).sort((a, b) => {
    const fallbackA = fallback.includes(a) ? -10 : 0;
    const fallbackB = fallback.includes(b) ? -10 : 0;
    return fallbackA - fallbackB || a.length - b.length || a.localeCompare(b, 'zh-CN');
  });
  return ranked.slice(0, 3);
}

function getStudyWords(wordOrChar) {
  const char = typeof wordOrChar === 'string' ? wordOrChar : wordOrChar.char;
  const manual = Array.isArray(manualStudyWords[char]) ? manualStudyWords[char] : [];
  return [...manual, ...getAutomaticStudyWords(char)].filter((term, index, all) => all.indexOf(term) === index).slice(0, 3);
}

function openWordGroupDialog(char) {
  if (!char) return;
  $('#wordGroupChar').textContent = char;
  $('#wordGroupCharInput').value = char;
  $('#wordGroupInput').value = (manualStudyWords[char] || []).join(' ');
  $('#sentenceCustomWordInput').value = '';
  $('#sentenceCustomWordInput').hidden = true;
  $('#sentenceTextInput').value = '';
  const automatic = getAutomaticStudyWords(char);
  $('#wordGroupSystem').textContent = automatic.length ? `系统推荐：${automatic.join(' · ')}` : '这个字暂时没有系统推荐词，可以手动补充。';
  renderSentenceEditor(char);
  showDialog($('#wordGroupDialog'));
  setTimeout(() => $('#wordGroupInput').focus(), 80);
}

function renderSentenceEditor(char) {
  const options = getStudyWords(char);
  $('#sentenceWordSelect').innerHTML = `${options.map((word) => `<option value="${escapeHtml(word)}">${escapeHtml(word)}</option>`).join('')}<option value="__custom__">＋ 手动输入其他词语</option>`;
  $('#sentenceWordSelect').value = options[0] || '__custom__';
  toggleCustomSentenceWord();
  const sentences = studySentences.filter((item) => item.char === char);
  $('#savedSentenceList').innerHTML = sentences.length
    ? sentences.map((item) => `<article><div><b>${escapeHtml(item.word)}</b><p>${escapeHtml(item.text)}</p></div><button type="button" data-delete-sentence="${item.id}" aria-label="删除这个句子">删除</button></article>`).join('')
    : '<p class="sentence-list-empty">还没有保存句子</p>';
}

function saveStudySentence() {
  const char = $('#wordGroupCharInput').value;
  const word = ($('#sentenceWordSelect').value === '__custom__' ? $('#sentenceCustomWordInput').value : $('#sentenceWordSelect').value).trim();
  const text = $('#sentenceTextInput').value.trim();
  if (!word || !word.includes(char)) return showToast(`词语中需要包含“${char}”`);
  if (!text || !text.includes(word)) return showToast('句子中需要包含所选词语');
  const normalized = normalizeSentence(text);
  if (normalized.length < 4) return showToast('句子至少需要4个文字');
  const createdAt = new Date().toISOString();
  studySentences.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, char, word, text, createdAt, updatedAt: createdAt });
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(studySentences));
  markTextbookStatusDirty();
  $('#sentenceTextInput').value = '';
  renderSentenceEditor(char);
  showToast('例句已保存，可以进行句子还原了');
}

function toggleCustomSentenceWord() {
  const isCustom = $('#sentenceWordSelect').value === '__custom__';
  $('#sentenceCustomWordInput').hidden = !isCustom;
  if (isCustom) setTimeout(() => $('#sentenceCustomWordInput').focus(), 30);
}

function deleteStudySentence(id) {
  studyContentMeta.deletedSentences[id] = new Date().toISOString();
  studySentences = studySentences.filter((item) => item.id !== id);
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(studySentences));
  saveStudyContentMeta();
  markTextbookStatusDirty();
  renderSentenceEditor($('#wordGroupCharInput').value);
  showToast('例句已删除');
}

function normalizeSentence(text) {
  return [...String(text)].filter((char) => /[\p{Script=Han}A-Za-z0-9]/u.test(char));
}

function saveManualStudyWords(event) {
  event.preventDefault();
  const char = $('#wordGroupCharInput').value;
  const raw = $('#wordGroupInput').value.trim();
  const entries = [...new Set(raw.split(/[\s,，、;；]+/).map((term) => term.trim()).filter(Boolean))];
  const invalid = entries.find((term) => !term.includes(char));
  if (invalid) return showToast(`“${invalid}”中没有“${char}”字`);
  if (entries.length > 3) return showToast('每个字最多补充3个词语');
  if (entries.length) manualStudyWords[char] = entries;
  else delete manualStudyWords[char];
  studyContentMeta.wordGroups[char] = { updatedAt: new Date().toISOString() };
  localStorage.setItem(MANUAL_WORDS_KEY, JSON.stringify(manualStudyWords));
  saveStudyContentMeta();
  markTextbookStatusDirty();
  closeDialog($('#wordGroupDialog'));
  if ($('#reviewView').classList.contains('active')) {
    renderReviewOverview();
    const current = queue[queueIndex];
    if (current?.char === char) {
      const studyWords = getStudyWords(current);
      $('#memoryCue').innerHTML = `<strong>${escapeHtml(getPinyin(char))}</strong><span>${studyWords.map(escapeHtml).join(' · ') || '大声读一读'}</span>${current.note ? `<small>${escapeHtml(current.note)}</small>` : ''}`;
    }
  }
  showToast(entries.length ? '组词已保存' : '手动组词已删除');
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

function shuffleCurrentLesson() {
  if (reviewScope !== 'lesson' || queue.length < 2) return;
  const activeMode = document.querySelector('[data-review-mode].active')?.dataset.reviewMode || 'card';
  queue = shuffled(queue);
  queueIndex = 0;
  reviewedCount = 0;
  renderCard({ preserveMode: true });
  switchReviewMode(activeMode);
  showToast('本课生字已打乱');
}

function showNextCard() {
  if (!queue.length) return;
  window.speechSynthesis?.cancel();
  const reachedEnd = queueIndex >= queue.length - 1;
  queueIndex = reachedEnd ? 0 : queueIndex + 1;
  renderCard();
  if (reachedEnd) showToast('已经看完一轮，从第一个字继续');
}

function switchReviewMode(mode) {
  document.querySelectorAll('[data-review-mode]').forEach((button) => button.classList.toggle('active', button.dataset.reviewMode === mode));
  document.querySelectorAll('.review-mode-panel').forEach((panel) => panel.classList.remove('active'));
  $(`#${mode}ModePanel`).classList.add('active');
  if (mode === 'overview') renderReviewOverview();
  if (mode === 'pair') renderPairGroup();
  if (mode === 'listen') startListenRound();
  if (mode === 'sentence') startSentenceRound();
}

function prepareReviewModes() {
  pairGroupIndex = 0;
  selectedPairChar = null;
  listenTarget = null;
  listenScore = 0;
  sentenceRound = null;
  sentenceAnswer = [];
  $('#listenScore').textContent = '答对 0 个';
  switchReviewMode('card');
  renderReviewOverview();
}

function renderReviewOverview() {
  const entries = uniqueQueueWords();
  $('#overviewCount').textContent = `${entries.length} 个字`;
  $('#reviewOverviewGrid').innerHTML = entries.map((word) => {
    const studyWords = getStudyWords(word);
    const wordLines = (studyWords.length ? studyWords : ['读一读']).map((item) => `<i>${escapeHtml(item)}</i>`).join('');
    return `<article class="overview-word"><button type="button" class="overview-word-main" data-overview-char="${word.char}"><span>${getPinyin(word.char)}</span><b>${word.char}</b><small>${wordLines}</small></button><button type="button" class="overview-word-edit" data-edit-study-words="${word.char}" aria-label="补充${word.char}的组词和造句">＋</button></article>`;
  }).join('');
  applyOverviewPinyinVisibility();
}

function applyOverviewPinyinVisibility() {
  $('#overviewModePanel').classList.toggle('pinyin-hidden', overviewPinyinHidden);
  $('#toggleOverviewPinyin').textContent = overviewPinyinHidden ? '显示拼音' : '隐藏拼音';
  $('#toggleOverviewPinyin').setAttribute('aria-pressed', String(overviewPinyinHidden));
}

function toggleOverviewPinyin() {
  overviewPinyinHidden = !overviewPinyinHidden;
  localStorage.setItem(OVERVIEW_PINYIN_KEY, String(overviewPinyinHidden));
  applyOverviewPinyinVisibility();
}

function renderPairGroup() {
  const entries = uniqueQueueWords();
  const totalGroups = Math.max(1, Math.ceil(entries.length / 4));
  if (pairGroupIndex >= totalGroups) pairGroupIndex = 0;
  const group = entries.slice(pairGroupIndex * 4, pairGroupIndex * 4 + 4);
  selectedPairChar = null;
  $('#pairProgress').textContent = `第 ${pairGroupIndex + 1} / ${totalGroups} 组`;
  $('#nextPairGroup').hidden = true;
  $('#volcanoCelebration').classList.remove('active');
  $('#volcanoCelebration').setAttribute('aria-hidden', 'true');
  $('#pairFeedback').textContent = '先选择左边的汉字';
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
    $('#pairFeedback').textContent = `已选择“${charButton.dataset.pairChar}”，请找出它的拼音`;
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
    const completed = [...document.querySelectorAll('[data-pair-char]')].every((button) => button.classList.contains('matched'));
    $('#pairFeedback').textContent = completed ? '太棒了，这一组全部配对成功！' : '配对正确，继续选择下一个汉字';
    if (completed) {
      $('#nextPairGroup').hidden = false;
      playVolcanoCelebration();
    }
  } else {
    $('#pairFeedback').textContent = '这个拼音还不对，再仔细看看';
    pinyinButton.classList.add('wrong');
    setTimeout(() => pinyinButton.classList.remove('wrong'), 420);
  }
}

function playVolcanoCelebration() {
  if (!volcanoAnimationEnabled) return;
  const celebration = $('#volcanoCelebration');
  celebration.classList.remove('active');
  void celebration.offsetWidth;
  celebration.classList.add('active');
  celebration.setAttribute('aria-hidden', 'false');
  clearTimeout(playVolcanoCelebration.timer);
  playVolcanoCelebration.timer = setTimeout(() => {
    celebration.classList.remove('active');
    celebration.setAttribute('aria-hidden', 'true');
  }, 3400);
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
    speakFeedback('Bingo');
    listenTarget = null;
    setTimeout(startListenRound, 900);
  } else {
    button.classList.add('wrong');
    $('#listenFeedback').textContent = '再听一次，慢慢找';
    setTimeout(() => button.classList.remove('wrong'), 450);
    playListenTarget();
  }
}

function getQueueSentences() {
  const chars = new Set(queue.map((word) => word.char));
  return studySentences.filter((item) => chars.has(item.char) && normalizeSentence(item.text).length >= 4);
}

function startSentenceRound() {
  const available = getQueueSentences();
  $('#sentenceProgress').textContent = `${available.length} 个句子`;
  $('#sentenceGameEmpty').hidden = available.length > 0;
  $('#sentenceGameContent').hidden = available.length === 0;
  if (!available.length) {
    sentenceRound = null;
    return;
  }
  const alternatives = sentenceRound && available.length > 1 ? available.filter((item) => item.id !== sentenceRound.item.id) : available;
  const item = alternatives[Math.floor(Math.random() * alternatives.length)];
  const targetChars = normalizeSentence(item.text);
  let tiles = shuffled(targetChars.map((char, index) => ({ char, id: `${item.id}-${index}` })));
  if (tiles.map((tile) => tile.char).join('') === targetChars.join('') && tiles.length > 1) tiles = [...tiles.slice(1), tiles[0]];
  sentenceRound = { item, targetChars, tiles };
  sentenceAnswer = [];
  $('#sentenceTargetWord').textContent = item.word;
  $('#sentenceTiles').innerHTML = tiles.map((tile, index) => `<button type="button" data-sentence-tile="${index}">${escapeHtml(tile.char)}</button>`).join('');
  $('#nextSentenceGame').hidden = true;
  $('#sentenceFeedback').textContent = '按正确顺序点击文字';
  renderSentenceAnswer();
}

function renderSentenceAnswer() {
  if (!sentenceRound) return;
  $('#sentenceAnswer').innerHTML = sentenceAnswer.length
    ? sentenceAnswer.map((entry, index) => `<button type="button" data-sentence-answer="${index}">${escapeHtml(entry.char)}</button>`).join('')
    : '<span>从下方选择第一个字</span>';
}

function chooseSentenceTile(event) {
  const button = event.target.closest('[data-sentence-tile]');
  if (!button || button.disabled || !sentenceRound) return;
  const tileIndex = Number(button.dataset.sentenceTile);
  sentenceAnswer.push({ ...sentenceRound.tiles[tileIndex], tileIndex });
  button.disabled = true;
  renderSentenceAnswer();
  if (sentenceAnswer.length !== sentenceRound.targetChars.length) return;
  const answer = sentenceAnswer.map((entry) => entry.char).join('');
  const target = sentenceRound.targetChars.join('');
  if (answer === target) {
    $('#sentenceAnswer').classList.add('correct');
    $('#sentenceFeedback').textContent = `还原成功：${sentenceRound.item.text}`;
    $('#nextSentenceGame').hidden = false;
    speakGameText(sentenceRound.item.text);
  } else {
    $('#sentenceAnswer').classList.add('wrong');
    $('#sentenceFeedback').textContent = '顺序还不对，再试一次';
    setTimeout(resetSentenceRound, 700);
  }
}

function undoSentenceTile(event) {
  const button = event.target.closest('[data-sentence-answer]');
  if (!button || !sentenceRound || $('#sentenceAnswer').classList.contains('correct')) return;
  const answerIndex = Number(button.dataset.sentenceAnswer);
  const [removed] = sentenceAnswer.splice(answerIndex, 1);
  const tile = $(`[data-sentence-tile="${removed.tileIndex}"]`);
  if (tile) tile.disabled = false;
  renderSentenceAnswer();
}

function resetSentenceRound() {
  if (!sentenceRound) return;
  sentenceAnswer = [];
  document.querySelectorAll('[data-sentence-tile]').forEach((button) => { button.disabled = false; });
  $('#sentenceAnswer').classList.remove('correct', 'wrong');
  $('#nextSentenceGame').hidden = true;
  $('#sentenceFeedback').textContent = '按正确顺序点击文字';
  renderSentenceAnswer();
}

function speakGameText(text) {
  if (!('speechSynthesis' in window)) return;
  stopFeedbackAudio();
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
  if (isTextbook) word.statusUpdatedAt = new Date().toISOString();
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
  if (isTextbook) {
    saveTextbookWords();
    markTextbookStatusDirty();
  }
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

function speakCurrentWord() {
  const char = $('#reviewWord').textContent;
  if (!('speechSynthesis' in window)) return showToast('当前浏览器不支持语音朗读');
  stopFeedbackAudio();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(getStudySpeechText(char));
  utterance.lang = 'zh-CN';
  utterance.rate = 0.72;
  utterance.pitch = 1;
  applySelectedVoice(utterance);
  const card = $('#wordCard');
  utterance.onstart = () => card.classList.add('speaking');
  utterance.onend = utterance.onerror = () => card.classList.remove('speaking');
  window.speechSynthesis.speak(utterance);
}

function getStudySpeechText(char) {
  const example = getStudyWords(char)[0];
  if (!speakWordExample || !example) return char;
  const firstSentence = studySentences.find((item) => item.char === char)?.text?.trim();
  return firstSentence ? `${char}，${example}的${char}。${firstSentence}` : `${char}，${example}的${char}`;
}

function speakStudyChar(char) {
  speakGameText(getStudySpeechText(char));
}

function speakFeedback(message) {
  window.speechSynthesis?.cancel();
  stopFeedbackAudio();
  const source = FEEDBACK_AUDIO_FILES[message];
  if (source) {
    const audio = new Audio(source);
    activeFeedbackAudio = audio;
    audio.preload = 'auto';
    audio.addEventListener('ended', () => { if (activeFeedbackAudio === audio) activeFeedbackAudio = null; }, { once: true });
    audio.play().catch(() => speakFeedbackWithSystem(message));
    return;
  }
  speakFeedbackWithSystem(message);
}

function stopFeedbackAudio() {
  if (!activeFeedbackAudio) return;
  activeFeedbackAudio.pause();
  activeFeedbackAudio.currentTime = 0;
  activeFeedbackAudio = null;
}

function speakFeedbackWithSystem(message) {
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
  const utterance = new SpeechSynthesisUtterance(speakWordExample ? '写，写字的写' : '你好，我来陪圈圈认字');
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
  reviewScope = 'all';
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
$('#speakWordExample').checked = speakWordExample;
$('#speakWordExample').addEventListener('change', (event) => {
  speakWordExample = event.target.checked;
  localStorage.setItem(SPEAK_WORD_EXAMPLE_KEY, String(speakWordExample));
});
$('#enableVolcanoAnimation').checked = volcanoAnimationEnabled;
$('#enableVolcanoAnimation').addEventListener('change', (event) => {
  volcanoAnimationEnabled = event.target.checked;
  localStorage.setItem(VOLCANO_ANIMATION_KEY, String(volcanoAnimationEnabled));
  if (!volcanoAnimationEnabled) {
    clearTimeout(playVolcanoCelebration.timer);
    $('#volcanoCelebration').classList.remove('active');
    $('#volcanoCelebration').setAttribute('aria-hidden', 'true');
  }
});
document.querySelectorAll('[data-review-mode]').forEach((button) => button.addEventListener('click', () => switchReviewMode(button.dataset.reviewMode)));
$('#reviewOverviewGrid').addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit-study-words]');
  if (editButton) return openWordGroupDialog(editButton.dataset.editStudyWords);
  const button = event.target.closest('[data-overview-char]');
  if (button) speakStudyChar(button.dataset.overviewChar);
});
$('#toggleOverviewPinyin').addEventListener('click', toggleOverviewPinyin);
$('#editCurrentWords').addEventListener('click', (event) => {
  event.stopPropagation();
  openWordGroupDialog(queue[queueIndex]?.char);
});
$('#closeWordGroup').addEventListener('click', () => closeDialog($('#wordGroupDialog')));
$('#wordGroupForm').addEventListener('submit', saveManualStudyWords);
$('#saveStudySentence').addEventListener('click', saveStudySentence);
$('#sentenceWordSelect').addEventListener('change', toggleCustomSentenceWord);
$('#savedSentenceList').addEventListener('click', (event) => {
  const button = event.target.closest('[data-delete-sentence]');
  if (button) deleteStudySentence(button.dataset.deleteSentence);
});
$('#pairModePanel').addEventListener('click', handlePairChoice);
$('#nextPairGroup').addEventListener('click', nextPairGroup);
$('#playListenWord').addEventListener('click', playListenTarget);
$('#listenChoices').addEventListener('click', handleListenChoice);
$('#sentenceTiles').addEventListener('click', chooseSentenceTile);
$('#sentenceAnswer').addEventListener('click', undoSentenceTile);
$('#resetSentenceGame').addEventListener('click', resetSentenceRound);
$('#nextSentenceGame').addEventListener('click', startSentenceRound);
$('#emptyAdd').addEventListener('click', openAddDialog);
$('#addedTab').addEventListener('click', () => switchLibraryMode('added'));
$('#reviewedTab').addEventListener('click', () => switchLibraryMode('reviewed'));
$('#allDates').addEventListener('click', () => { libraryFilters[libraryMode] = 'all'; renderLibrary(); });
$('#libraryDate').addEventListener('change', (event) => { libraryFilters[libraryMode] = event.target.value || 'all'; renderLibrary(); });
$('#closeAdd').addEventListener('click', () => closeDialog($('#addDialog')));
$('#addForm').addEventListener('submit', addWords);
$('#startReview').addEventListener('click', startReview);
$('#exitReview').addEventListener('click', returnFromReview);
$('#shuffleCurrentLesson').addEventListener('click', shuffleCurrentLesson);
$('#nextCard').addEventListener('click', showNextCard);
$('#wordCard').addEventListener('click', (event) => {
  if (event.target.closest('button')) return;
  const card = $('#wordCard');
  card.classList.toggle('revealed');
  $('#revealPrompt').textContent = card.classList.contains('revealed') ? '提示已经出现，点卡片可再次听读音' : '先自己读一读，再点卡片听读音和看提示';
  speakCurrentWord();
});
$('#wordCard').addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  event.currentTarget.click();
});
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
$('#selectedStatusButton').addEventListener('click', openSelectedLessonsStatus);
$('#closeStatusDialog').addEventListener('click', () => closeDialog($('#textbookStatusDialog')));
$('#textbookStatusDialog').addEventListener('click', (event) => {
  const button = event.target.closest('[data-apply-status]');
  if (button) applyTextbookStatus(Number(button.dataset.applyStatus));
});
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
  const lessonStatus = event.target.closest('[data-status-lesson]');
  const unitStatus = event.target.closest('[data-status-unit]');
  const bookStatus = event.target.closest('[data-status-book]');
  const wordTile = event.target.closest('[data-textbook-id]');
  if (!reviewButton && !editButton && !lessonStatus && !unitStatus && !bookStatus && !wordTile) return;
  event.preventDefault();
  event.stopPropagation();
  if (reviewButton) startLessonReview(decodeURIComponent(reviewButton.dataset.reviewLesson));
  else if (editButton) openTextbookDialog(decodeURIComponent(editButton.dataset.editLesson));
  else if (lessonStatus) {
    const key = decodeURIComponent(lessonStatus.dataset.statusLesson);
    const lessonWords = textbookWords.filter((word) => lessonKey(word) === key);
    openTextbookStatusDialog(lessonWords.map((word) => word.id), lessonWords[0]?.unit || '当前课时');
  } else if (unitStatus) {
    const [grade, semester, unitName] = JSON.parse(decodeURIComponent(unitStatus.dataset.statusUnit));
    const unitWords = textbookWords.filter((word) => String(word.grade) === grade && String(word.semester) === semester && (word.bookUnit || '自定义课时') === unitName);
    openTextbookStatusDialog(unitWords.map((word) => word.id), `${gradeText(grade)}${semesterText(semester)} · ${unitName}`);
  } else if (bookStatus) {
    const [grade, semester] = decodeURIComponent(bookStatus.dataset.statusBook).split('-');
    const bookWords = textbookWords.filter((word) => String(word.grade) === grade && String(word.semester) === semester);
    openTextbookStatusDialog(bookWords.map((word) => word.id), `${gradeText(grade)}${semesterText(semester)}`);
  } else {
    const word = textbookWords.find((item) => item.id === wordTile.dataset.textbookId);
    if (word) openTextbookStatusDialog([word.id], `“${word.char}”`);
  }
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
window.addEventListener('online', syncTextbookStatuses);
window.addEventListener('offline', () => setStatusSyncState('离线保存', 'offline'));
renderHome();
renderTextbook();
showView('textbookView');
loadRemoteTextbookCatalog();
initVoiceSelector();
