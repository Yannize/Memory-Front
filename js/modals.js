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
  submitError: {},

  /**
   * fonction qui permet de fermer n'importe quelle fenêtre modale
   *
   * @param {Event} e - l'évènement qu'on reçoit après avoir cliqué n'importe ou sur la page
   */
  closeModals: (e) => {
    // on stock l'index zéro de la list des classe de l'élément cliqué
    const elemClass = e.target.classList[0];

    // si cette classe correspond à close-modal ou 'body-blackout'
    if (elemClass === 'close-modal' || elemClass === 'body-blackout') {
      // on retire la classe active de toutes les modales
      modals.modals.forEach((modal) => modal.classList.remove('active'));
      // on reset les value des inputs dans le cas ou la modale fermé était la modale de sauvegarde du score
      modals.form[0].value = '';
      modals.form[1].value = '';
      // on vide la board dans le cas ou la modale fermé était une modale de fin de partie
      app.board.textContent = '';
      // on enlève la classe active de l'effet d'assombrissement qui couvre l'application pour le faire disparaître
      modals.bodyBlackout.classList.remove('active');
      // on cache la div.timer dans le cas ou la modale fermé était une modale de fin de partie
      timer.timerDiv.classList.remove('active');
      // on ré-affiche le bouton qui permet d'accéder au score dans le cas ou la modale fermé était une modale de fin de partie
      modals.btnScoreBoard.style.display = 'block';
    }
  },

  /**
   * fonction qui affiche la modale du tableau de score
   */
  openScoreBoard: () => {
    modals.bodyBlackout.classList.add('active');
    modals.modalScoreBoard.classList.add('active');
  },

  /**
   *
   * @param {Object} message - title(string), text(string), displayForm(booléen)
   */
  onEndGame: (message) => {
    // si displayForm true, c'est une partie gagné, affiche le message de win et on affiche le formulaire
    if (message.displayForm) {
      modals.h2.textContent = message.title;
      modals.p.textContent = message.text;
      modals.form.classList.add('active');
      // sinon c'est une partie perdu, on affiche le message de loose et on affiche le formulaire
    } else {
      modals.h2.textContent = message.title;
      modals.p.textContent = message.text;
      modals.form.classList.remove('active');
    }
    // dans tous les cas on affiche la modale de fin de partie et l'effet d'assombrissement
    modals.bodyBlackout.classList.add('active');
    modals.modalEndGame.classList.add('active');
  },

  /**
   * fonction asynchrone car si tous les champs sont validés on va effectuer une requête POST pour sauvegarder le pseudo et le score
   *
   * @param {Event} e - l'event qu'on récupère au submit du formulaire (clique ou touche entrée pour submit)
   */
  onSubmit: async (e) => {
    // on empêche le comportement par défaut d'un submit de formulaire qui est le rafraîchissement de la page
    e.preventDefault();

    // on vérifie ce qui est entré dans l'input pseudo et l'input hidden (l'input hidden contient le temps écoulé, ce n'est pas à l'utilisateur de le remplir)
    // si c'est vide on stock un message d'erreur adapté
    if (e.target[0].value === '') {
      modals.submitError =
        'vous devez entrer un pseudo pour enregistrer votre score';
      // sinon si la valeur saisie à une taille supérieur à 20 charactères, on stock un message d'erreur adapté
    } else if (e.target[0].value.length > 20) {
      modals.submitError = 'maximum 20 charactères';

      // sinon si la valeur de l'input hidden n'est pas un chiffre ou est un nombre décimal ou à une taille inférieur à 1 ou supérieur à 2 (regex)
      // on affiche un message d'erreur adapté pour ceux qui essayeraient de tricher en modifier la value à la main avec l'inspecteur du navigateur !
    } else if (!/^-?[0-9]{1,2}$/.test(e.target[1].value)) {
      modals.submitError = 'Hé ! pas touche à ce champ !!';

      // sinon on remet à vide la propriété submitError, c'est qu'il n'y a plus d'erreur
    } else {
      modals.submitError = '';
    }

    // on affiche met le message d'erreur dans le textContent de la balise p prévue à cette effet (vide de base)
    modals.form.querySelector('p.error-message').textContent =
      modals.submitError;

    // s'il n'y a pas de message d'erreur, c'est que tout est OK
    if (!modals.submitError) {
      // on crée une instance de FormData grâce à la classe native JS FormData et on lui passe le formulaire
      // ça va automatiquement remplir le FormData avec le name des inputs en clef et leur value en valeur
      const data = new FormData(e.target);

      // on essaie de fetch avec la méthode POST sur la route /add-score ce FormData en le plaçant dans le body de la requête
      try {
        // asynchrone donc on await
        const result = await fetch(
          'https://memory-back.herokuapp.com/add-score',
          {
            method: 'POST',
            body: data,
          }
        );

        // grâce au try catch, s'il n'y a pas d'erreur pendant l'await on redirige vers https://memory-back.herokuapp.com/Memory-Front/
        // ça aura pour effet de rafraîchir la page, et de voir le nouveau score entré à l'arrivé sur le site
        window.location = '/Memory-Front/';
      } catch (error) {
        console.log(error);
      }
    }
  },

  /**
   * on accroche les listener
   */
  listenerInit: () => {
    document.addEventListener('click', modals.closeModals);
    modals.btnScoreBoard.addEventListener('click', modals.openScoreBoard);
    modals.form.addEventListener('submit', modals.onSubmit);
  },

  /**
   * on initialise les propriétés utiles à l'objet modals
   */
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

    modals.listenerInit();
  },
};
