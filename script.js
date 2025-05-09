let time = 25 * 60;  // 25 minutes in seconds
let timerInterval;
let running = false;
let sessions = 0; // Completed sessions

// Timer update function
function updateDisplay() {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  document.querySelector('.timer').innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Countdown logic
function countdown() {
  if (time > 0) {
    time--;
    updateDisplay();
  } else {
    clearInterval(timerInterval);
    sessions++;
    increaseWater(); // Increase water after each Pomodoro session
    time = 25 * 60; // Reset the timer
    updateDisplay();
  }
}

// Water level increase function
function increaseWater() {
  let newHeight = sessions * 20;
  if (newHeight > 100) newHeight = 100;
  document.getElementById('water').style.height = `${newHeight}%`;
}

// Event listeners for buttons
document.getElementById('start').onclick = () => {
  if (!running) {
    running = true;
    timerInterval = setInterval(countdown, 1000);
  }
};

document.getElementById('pause').onclick = () => {
  clearInterval(timerInterval);
  running = false;
};

document.getElementById('reset').onclick = () => {
  clearInterval(timerInterval);
  running = false;
  time = 25 * 60;
  updateDisplay();
};

// Initialize
updateDisplay();
