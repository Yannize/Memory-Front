const timer = {
  timerDiv: null,
  timerSpan: null,
  progressBar: null,
  progress: null,
  interval: null,
  countDownStart: 60,
  timeSpent: 0,
  timeoutMessage: {
    title: 'Perdu...',
    text: 'Dommage ! le temps imparti est écoulé, rententez votre chance :)',
    displayForm: false,
  },

  /**
   * fonction qui affiche et lance le timer
   */
  displayAndStartTimer: () => {
    // on ajoute la classe active à la div.timer pour la rendre visible
    timer.timerDiv.classList.add('active');
    // on utilise une ternaire pour remplir le text content de la span affichant le décompte
    timer.timerSpan.textContent =
      // si le décompte est supérieur à 1
      timer.countDownStart > 1
        ? // pluriel
          `${timer.countDownStart} secondes`
        : // sinon singulier
          `${timer.countDownStart} seconde`;

    // on initialise un setInverval de 1seconde qu'on stock pour pouvoir le stopper plus tard
    timer.interval = setInterval(() => {
      // on décrément de 1 le décompte (toutes les 1 secondes)
      timer.countDownStart--;
      // on incrémente de 1 le temps écoulé (toutes les 1 sec...)
      timer.timeSpent++;
      // on modifie la span qui affiche le décompte (toutes les 1...)
      timer.timerSpan.textContent =
        timer.countDownStart > 1
          ? `${timer.countDownStart} secondes`
          : `${timer.countDownStart} seconde`;

      // on chance le style de la progress bar pour la faire avancer (...)
      timer.progress.style.width = `${(timer.timeSpent * 100) / 60}%`;

      // si le temps écoulé est inférieur à 30
      if (timer.countDownStart <= 30 && timer.countDownStart > 10) {
        // on change la couleur de la progress bar
        timer.progressBar.style.background = 'orange';
      }
      // en desous de 10
      if (timer.countDownStart <= 10) {
        // on change la couleur de la progress bar
        timer.progressBar.style.background = 'red';
      }

      // si le temps écoulé est égal à zéro
      if (timer.countDownStart === 0) {
        // on stop le décompte
        clearInterval(timer.interval);
        // un peu de style
        timer.progress.style.borderRadius = '10px';
        // on modifie des propriétés
        app.gameIsOver.end = true;
        app.gameIsOver.reason = 'time out';
        // on lance la fonction app.endGame en lui passant timer.timeoutMessage
        modals.onEndGame(timer.timeoutMessage);
      }
    }, 1000);
  },

  /**
   * fonction qui permet de remettre reset et relancer le timer
   */
  restartTimer: () => {
    // on stop le setInterval
    clearInterval(timer.interval);
    // on surpprimer l'id de l'ancien setInterval
    timer.interval = null;
    // on reset le style de la progress bar
    timer.progress.style.borderRadius = '10px 0 0 10px';
    timer.progressBar.style.background = 'green';
    timer.progress.style.width = `0%`;
    // on remet à 60 le décompte
    timer.countDownStart = 60;
    // on remet à 0 le temps écoulé
    timer.timeSpent = 0;
    // on relance la fonction timer.displayAndStartTimer
    timer.displayAndStartTimer();
  },

  /**
   * initialisation des propriétés utiles dans timer
   */
  init: () => {
    timer.timerDiv = document.querySelector('.timer');
    timer.timerSpan = timer.timerDiv.querySelector('span');
    timer.progressBar = timer.timerDiv.querySelector('.progress-bar');
    timer.progress = timer.timerDiv.querySelector('.progress');
  },
};
