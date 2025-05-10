const startBtn = document.getElementById("startBtn");
const appContent = document.getElementById("appContent");
const inputBox = document.getElementById("inputBox");
const submitTimes = document.getElementById("submitTimes");

const timerSection = document.getElementById("timerSection");
const timerCircle = document.getElementById("timerCircle");
const phaseLabel = document.getElementById("phaseLabel");

const focusReport = document.getElementById("focusReport");
const focusTimeResult = document.getElementById("focusTimeResult");
const totalFocusTime = document.getElementById("totalFocusTime");

const startControl = document.getElementById("startControl");
const pauseControl = document.getElementById("pauseControl");
const resetControl = document.getElementById("resetControl");

let focusTime = 0, breakTime = 0, reviseTime = 0;
let timeLeft = 0;
let timer = null;
let isRunning = false;
let currentPhase = "focus";
let totalFocus = 0;
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
  phaseLabel.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);

  if (phase === "focus") timeLeft = focusTime;
  else if (phase === "break") timeLeft = breakTime;
  else if (phase === "revision") timeLeft = reviseTime;

  updateDisplay(timeLeft);
}

function updateDisplay(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  timerCircle.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

startControl.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay(timeLeft);
      } else {
        clearInterval(timer);
        isRunning = false;

        if (currentPhase === "focus") {
          totalFocus += focusTime;
          startPhase("break");
        } else if (currentPhase === "break") {
          startPhase("revision");
        } else if (currentPhase === "revision") {
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

  if (currentPhase === "focus") timeLeft = focusTime;
  else if (currentPhase === "break") timeLeft = breakTime;
  else if (currentPhase === "revision") timeLeft = reviseTime;

  updateDisplay(timeLeft);
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
