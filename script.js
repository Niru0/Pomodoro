const startBtn = document.getElementById("startBtn");
const appContent = document.getElementById("appContent");
const inputBox = document.getElementById("inputBox");
const submitTimes = document.getElementById("submitTimes");

const timerSection = document.getElementById("timerSection");
const timerText = document.getElementById("timerText");
const phaseLabel = document.getElementById("phaseLabel");

const focusReport = document.getElementById("focusReport");
const focusTimeResult = document.getElementById("focusTimeResult");
const totalFocusTime = document.getElementById("totalFocusTime");

const startControl = document.getElementById("startControl");
const pauseControl = document.getElementById("pauseControl");
const resetControl = document.getElementById("resetControl");

const circleTimer = document.getElementById("circleTimer");

let focusTime = 0, breakTime = 0, reviseTime = 0;
let timeLeft = 0;
let timer = null;
let isRunning = false;
let currentPhase = "focus";
let totalFocus = 0;
let fullTime = 0;
let storedTotalFocus = parseInt(localStorage.getItem("totalFocusMinutes")) || 0;

startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  appContent.classList.remove("hidden");
  inputBox.classList.remove("hidden");
});

submitTimes.addEventListener("click", () => {
  focusTime = parseInt(document.getElementById("focusInput").value) * 60;
  breakTime = parseInt(document.getElementById("breakInput").value) * 60;
  reviseTime = parseInt(document.getElementById("reviseInput").value) * 60;

  if (!focusTime || !breakTime || !reviseTime) {
    alert("Please enter all times");
    return;
  }

  inputBox.classList.add("hidden");
  focusReport.classList.add("hidden");
  timerSection.classList.remove("hidden");

  startPhase("focus");
});

function startPhase(phase) {
  currentPhase = phase;

  if (phase === "focus") {
    timeLeft = focusTime;
    fullTime = focusTime;
    phaseLabel.textContent = "Study";
  } else if (phase === "break") {
    timeLeft = breakTime;
    fullTime = breakTime;
    phaseLabel.textContent = "Break";
  } else {
    timeLeft = reviseTime;
    fullTime = reviseTime;
    phaseLabel.textContent = "Revise";
  }

  updateDisplay();
  updateCircle();
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateCircle() {
  const percent = ((fullTime - timeLeft) / fullTime) * 100;
  circleTimer.style.background = `conic-gradient(#3498db ${percent}%, #ddd ${percent}%)`;
}

startControl.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        updateCircle();
      } else {
        clearInterval(timer);
        isRunning = false;

        if (currentPhase === "focus") {
          totalFocus += focusTime;
          startPhase("break");
        } else if (currentPhase === "break") {
          startPhase("revise");
        } else {
          showReport();
        }
      }
    }, 1000);
  }
});

pauseControl.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
});

resetControl.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  startPhase(currentPhase);
});

function showReport() {
  timerSection.classList.add("hidden");
  focusReport.classList.remove("hidden");

  const sessionMinutes = Math.round(totalFocus / 60);
  storedTotalFocus += sessionMinutes;
  localStorage.setItem("totalFocusMinutes", storedTotalFocus);

  focusTimeResult.textContent = sessionMinutes;
  totalFocusTime.textContent = storedTotalFocus;
}
