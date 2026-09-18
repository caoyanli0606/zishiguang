const STORAGE_KEY = 'zishiguang-words-v1';
const HISTORY_KEY = 'zishiguang-history-v1';
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

const cloudConfigured = () => /^https:\/\/.+\.supabase\.co\/?$/.test(CLOUD.url || '') && Boolean(CLOUD.publishableKey);
const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

function saveWords(sync = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  if (sync) scheduleCloudPush();
}

function saveHistory(history, sync = true) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([...new Set(history)]));
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

async function pullAndMergeCloud(showMessage = false) {
  if (!cloudConfigured() || !familyId || isSyncing || !navigator.onLine) return;
  isSyncing = true;
  setCloudStatus('syncing', '同步中');
  try {
    const endpoint = `${CLOUD.url.replace(/\/$/, '')}/rest/v1/family_data?family_id=eq.${familyId}&select=payload`;
    const response = await fetch(endpoint, { headers: cloudHeaders() });
    if (!response.ok) throw new Error(`读取失败 (${response.status})`);
    const rows = await response.json();
    if (rows.length) {
      const payload = rows[0].payload || {};
      words = mergeWords(words, Array.isArray(payload.words) ? payload.words : []);
      saveWords(false);
      saveHistory([...getHistory(), ...(Array.isArray(payload.history) ? payload.history : [])], false);
      renderHome();
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
  const endpoint = `${CLOUD.url.replace(/\/$/, '')}/rest/v1/family_data?on_conflict=family_id`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: cloudHeaders({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({ family_id: familyId, payload: { words, history: getHistory(), version: 1 }, updated_at: new Date().toISOString() })
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
  $('.topbar').style.display = id === 'homeView' ? 'flex' : 'none';
  $('.hero').style.display = id === 'homeView' ? 'flex' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome() {
  const due = words.filter((word) => !word.nextReview || word.nextReview <= today());
  $('#dueCount').textContent = due.length;
  $('#totalCount').textContent = `${words.length} 个字`;
  $('#startReview').disabled = due.length === 0;
  $('#startReview span:first-child').textContent = due.length ? '开始今日复习' : '今天已经复习完啦';
  $('#emptyLibrary').classList.toggle('show', words.length === 0);
  $('#wordList').innerHTML = words
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((word) => `<button class="word-tile level-${word.level || 0}" data-id="${word.id}" aria-label="${word.char}，${levelText(word.level)}">
      <span class="level-dot"></span><b>${word.char}</b><small>${levelText(word.level)}</small>
    </button>`).join('');
  renderStreak();
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
  queue = words.filter((word) => !word.nextReview || word.nextReview <= today());
  if (!queue.length) return;
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
  $('#reviewDate').textContent = `${formatDate(word.createdAt)}认识`;
  $('#reviewProgress').textContent = `${queueIndex + 1} / ${queue.length}`;
  $('#progressBar').style.width = `${(queueIndex / queue.length) * 100}%`;
}

function rateWord(level) {
  window.speechSynthesis?.cancel();
  const current = queue[queueIndex];
  const word = words.find((item) => item.id === current.id);
  const days = level === 1 ? 0 : level === 2 ? 2 : 7;
  const next = new Date();
  next.setDate(next.getDate() + days);
  word.level = level;
  word.reviewCount = (word.reviewCount || 0) + 1;
  word.lastReviewed = today();
  word.nextReview = next.toLocaleDateString('sv-SE');
  saveWords();
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
  $('#completeSummary').textContent = `你刚刚复习了 ${reviewedCount} 个字，真不错。`;
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
$('#closeAdd').addEventListener('click', () => $('#addDialog').close());
$('#addForm').addEventListener('submit', addWords);
$('#startReview').addEventListener('click', startReview);
$('#exitReview').addEventListener('click', () => { showView('homeView'); renderHome(); });
$('#wordCard').addEventListener('click', () => $('#wordCard').classList.toggle('revealed'));
$('#speakWord').addEventListener('click', speakCurrentWord);
document.querySelectorAll('[data-rating]').forEach((button) => button.addEventListener('click', () => rateWord(Number(button.dataset.rating))));
$('#backHome').addEventListener('click', () => { showView('homeView'); renderHome(); });

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
if (familyId && cloudConfigured()) pullAndMergeCloud();
