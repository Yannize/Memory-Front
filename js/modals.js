const modals = {
  modals: null,
  btnModalClose: null,
  btnScoreBoard: null,
  modalScoreBoard: null,
  bodyBlackout: null,
  modalEndGame: null,
  h2: null,
  p: null,
  form: null,
  hiddenInput: null,

  closeModals: (e) => {
    const elemClass = e.target.classList[0];
    if (elemClass === 'close-modal' || elemClass === 'body-blackout') {
      modals.modals.forEach((modal) => modal.classList.remove('active'));
      modals.form[0].value = '';
      modals.form[1].value = '';
      app.board.textContent = '';
      modals.bodyBlackout.classList.remove('active');
      timer.timerDiv.classList.remove('active');
      modals.btnScoreBoard.style.display = 'block';
    }
  },

  openScoreBoard: (e) => {
    modals.bodyBlackout.classList.add('active');
    modals.modalScoreBoard.classList.add('active');
  },

  onEndGame: (message) => {
    if (message.displayForm) {
      modals.h2.textContent = message.title;
      modals.p.textContent = message.text;
      console.log(message);
      modals.form.classList.add('active');
    } else {
      modals.h2.textContent = message.title;
      modals.p.textContent = message.text;
      modals.form.classList.remove('active');
    }
    modals.bodyBlackout.classList.add('active');
    modals.modalEndGame.classList.add('active');
  },

  init: () => {
    modals.modals = document.querySelectorAll('.modal');
    modals.bodyBlackout = document.querySelector('.body-blackout');
    modals.modalScoreBoard = document.querySelector('.modal.score-board');
    modals.btnModalClose = document.querySelectorAll('.close-modal');
    modals.btnScoreBoard = document.querySelector('button.score-board');
    modals.modalEndGame = document.querySelector('.modal.end-game');
    modals.h2 = modals.modalEndGame.querySelector('h2');
    modals.p = modals.modalEndGame.querySelector('p');
    modals.form = modals.modalEndGame.querySelector('form');
    modals.hiddenInput = modals.form.querySelector('input[type="hidden"]');

    document.addEventListener('click', modals.closeModals);
    modals.btnScoreBoard.addEventListener('click', modals.openScoreBoard);
  },
};
