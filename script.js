const startBtn = document.getElementById("startBtn");
const inputBox = document.getElementById("inputBox");
const submitTimes = document.getElementById("submitTimes");
const timerSection = document.getElementById("timerSection");
const timerCircle = document.getElementById("timerCircle");
const phaseLabel = document.getElementById("phaseLabel");
const nextBtn = document.getElementById("nextBtn");
const focusReport = document.getElementById("focusReport");
const focusTimeResult = document.getElementById("focusTimeResult");
let storedTotalFocus = parseInt(localStorage.getItem("totalFocusMinutes")) || 0;


let focusTime = 0, breakTime = 0, revisionTime = 0;
let currentPhase = "focus";
let timer;
let totalFocus = 0;

startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    document.getElementById("appContent").classList.remove("hidden");
    inputBox.classList.remove("hidden");
  });
  
submitTimes.addEventListener("click", () => {
  focusTime = parseInt(document.getElementById("focusInput").value) * 60;
  breakTime = parseInt(document.getElementById("breakInput").value) * 60;
  revisionTime = parseInt(document.getElementById("reviseInput").value) * 60;

  inputBox.classList.add("hidden");
  timerSection.classList.remove("hidden");
  startPhase("focus", focusTime);
});

nextBtn.addEventListener("click", () => {
  nextBtn.classList.add("hidden");

  if (currentPhase === "focus") {
    startPhase("break", breakTime);
  } else if (currentPhase === "break") {
    startPhase("revision", revisionTime);
  } else if (currentPhase === "revision") {
    timerSection.classList.add("hidden");
    focusReport.classList.remove("hidden");
    const sessionMinutes = Math.round(totalFocus / 60);
    storedTotalFocus += sessionMinutes;
    localStorage.setItem("totalFocusMinutes", storedTotalFocus);
    
    focusTimeResult.textContent = sessionMinutes;
    document.getElementById("totalFocusTime").textContent = storedTotalFocus;
    
  }
});

function startPhase(phase, duration) {
  currentPhase = phase;
  phaseLabel.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
  let time = duration;
  if (phase === "focus" || phase === "revision") {
    totalFocus += duration;
  }

  clearInterval(timer);
  updateDisplay(time);
  timer = setInterval(() => {
    time--;
    updateDisplay(time);
    if (time <= 0) {
      clearInterval(timer);
      nextBtn.textContent = getNextButtonText(phase);
      nextBtn.classList.remove("hidden");
    }
  }, 1000);
}

function updateDisplay(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  timerCircle.textContent = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getNextButtonText(current) {
  if (current === "focus") return "Start Break";
  if (current === "break") return "Start Revision";
  if (current === "revision") return "View Focus Report";
}

