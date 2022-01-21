const timer = {
  timerDiv: null,
  timerSpan: null,
  progressBar: null,
  progress: null,
  interval: null,
  countDownStart: 60,
  timeSpent: 0,
  timeout: false,
  timeoutMessage: {
    title: 'Perdu...',
    text: 'Dommage ! le temps imparti est écoulé, rententez votre chance :)',
    displayForm: false,
  },

  displayAndStartTimer: () => {
    timer.timerDiv.classList.add('active');
    timer.timerSpan.textContent =
      timer.countDownStart > 1
        ? `${timer.countDownStart} secondes`
        : `${timer.countDownStart} seconde`;
    timer.interval = setInterval(() => {
      timer.countDownStart--;
      timer.timeSpent++;
      timer.timerSpan.textContent =
        timer.countDownStart > 1
          ? `${timer.countDownStart} secondes`
          : `${timer.countDownStart} seconde`;
      timer.progress.style.width = `${(timer.timeSpent * 100) / 60}%`;

      if (timer.countDownStart <= 30 && timer.countDownStart > 10) {
        timer.progressBar.style.background = 'orange';
      }
      if (timer.countDownStart <= 10) {
        timer.progressBar.style.background = 'red';
      }

      if (timer.countDownStart === 0) {
        clearInterval(timer.interval);
        timer.progress.style.borderRadius = '10px';
        timer.timeout = true;
        app.gameIsOver.end = true;
        app.gameIsOver.reason = 'time out';
        app.endGame(timer.timeoutMessage);
      }
    }, 1000);
  },

  restartTimer: () => {
    clearInterval(timer.interval);
    timer.interval = null;
    timer.progress.style.borderRadius = '10px 0 0 10px';
    timer.progressBar.style.background = 'green';
    timer.progress.style.width = `0%`;
    timer.countDownStart = 60;
    timer.timeSpent = 0;
    timer.displayAndStartTimer();
  },

  init: () => {
    timer.timerDiv = document.querySelector('.timer');
    timer.timerSpan = timer.timerDiv.querySelector('span');
    timer.progressBar = timer.timerDiv.querySelector('.progress-bar');
    timer.progress = timer.timerDiv.querySelector('.progress');
  },
};
