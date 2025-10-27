// ---------------------- 페이지 이동 관련 ----------------------
function goToSubject(subject) {
  localStorage.setItem('subject', subject);
  window.location.href = 'subject.html';
}

function goHome() {
  window.location.href = 'index.html';
}

function goBackToSubject() {
  window.location.href = 'subject.html';
}

function goToPerformance() {
  window.location.href = 'performance.html';
}

function goToExam() {
  window.location.href = 'exam.html';
}

// ---------------------- 과목 이름 변환 ----------------------
function subjectName(subj) {
  const map = {
    korean: '국어',
    english: '영어',
    math: '수학',
    science: '과학',
    history: '역사'
  };
  return map[subj] || '과목';
}

// ---------------------- 페이지별 제목 표시 ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const subject = localStorage.getItem('subject');
  const title = document.getElementById('subject-title');
  const perfTitle = document.getElementById('performance-title');
  const examTitle = document.getElementById('exam-title');

  if (title) title.textContent = subjectName(subject) + ' 공부하기';
  if (perfTitle) perfTitle.textContent = subjectName(subject) + ' 수행평가 대비 자료';
  if (examTitle) examTitle.textContent = subjectName(subject) + ' 지필고사 대비';
});

// ---------------------- 수행평가 자료 표시 ----------------------
window.addEventListener('DOMContentLoaded', () => {
  const subject = localStorage.getItem('subject');
  const gallery = document.getElementById('performance-gallery');
  if (gallery) {
    const imgs = [`images/performance/${subject}1.jpg`];
    imgs.forEach(path => {
      const img = document.createElement('img');
      img.src = path;
      img.alt = '자료';
      img.style.width = '100%';
      img.style.marginBottom = '15px';
      gallery.appendChild(img);
    });
  }
});

// ---------------------- 시험 시스템 ----------------------
let currentIndex = 0;
let currentQuestions = [];
let timerInterval;
let seconds = 0;

// 문제 + 정답 등록
const questionData = {
  korean: {
    easy: [
      { img: 'images/korean/easy1.jpg', answer: '가' },
      { img: 'images/korean/easy2.jpg', answer: '나' },
      { img: 'images/korean/easy3.jpg', answer: '다' },
    ]
  }
};

function startExam(level) {
  const subject = localStorage.getItem('subject');
  currentQuestions = questionData[subject]?.[level] || [];

  if (currentQuestions.length === 0) {
    alert('등록된 문제가 없습니다.');
    return;
  }

  document.getElementById('difficulty-select').classList.add('hidden');
  document.getElementById('exam-area').classList.remove('hidden');

  currentIndex = 0;
  showQuestion();
  startTimer();
}

function showQuestion() {
  const img = document.getElementById('question-img');
  const input = document.getElementById('answer-input');
  input.value = '';
  img.src = currentQuestions[currentIndex].img;
}

function checkAnswer() {
  const input = document.getElementById('answer-input');
  const userAnswer = input.value.trim();
  const correct = currentQuestions[currentIndex].answer;

  if (userAnswer === '') {
    alert('정답을 입력하세요!');
    return;
  }

  if (userAnswer === correct) {
    input.classList.add('correct');
    setTimeout(() => input.classList.remove('correct'), 400);
    nextQuestion();
  } else {
    alert('❌ 오답입니다. 다시 시도하세요.');
  }
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= currentQuestions.length) {
    stopTimer();
    alert(`🎉 모든 문제를 풀었습니다! 총 시간: ${formatTime(seconds)}`);
    goBackToSubject();
  } else {
    showQuestion();
  }
}

function startTimer() {
  seconds = 0;
  const timerDisplay = document.getElementById('timer');
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = '⏱ ' + formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
