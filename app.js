const STORAGE_KEY = 'zishiguang-words-v1';
const HISTORY_KEY = 'zishiguang-history-v1';

const $ = (selector) => document.querySelector(selector);
const today = () => new Date().toLocaleDateString('sv-SE');
const formatDate = (date) => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(new Date(`${date}T12:00:00`));

let words = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let queue = [];
let queueIndex = 0;
let reviewedCount = 0;

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
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
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').sort().reverse();
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
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  if (!history.includes(today())) history.push(today());
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
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

$('#todayLabel').textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
$('#openAdd').addEventListener('click', openAddDialog);
$('#emptyAdd').addEventListener('click', openAddDialog);
$('#closeAdd').addEventListener('click', () => $('#addDialog').close());
$('#addForm').addEventListener('submit', addWords);
$('#startReview').addEventListener('click', startReview);
$('#exitReview').addEventListener('click', () => { showView('homeView'); renderHome(); });
$('#wordCard').addEventListener('click', () => $('#wordCard').classList.toggle('revealed'));
document.querySelectorAll('[data-rating]').forEach((button) => button.addEventListener('click', () => rateWord(Number(button.dataset.rating))));
$('#backHome').addEventListener('click', () => { showView('homeView'); renderHome(); });

let touchStartX = 0;
$('#wordCard').addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
$('#wordCard').addEventListener('touchend', (e) => {
  const distance = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 75) rateWord(distance > 0 ? 3 : 1);
}, { passive: true });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
renderHome();
