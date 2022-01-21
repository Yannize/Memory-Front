const app = {
  board: null,
  btnStart: null,
  shuffledCard: null,
  choice: {
    firstCard: null,
    secondCard: null,
    selectedCards: [],
    foundedPair: [],
  },
  disabled: false,
  gameIsOver: {
    end: false,
    reason: '',
  },
  winMessage: {
    title: 'Gagné !!!',
    text: null,
    displayForm: true,
  },
  cards: [
    { src: 'img/helmet-1.png' },
    { src: 'img/potion-1.png' },
    { src: 'img/ring-1.png' },
    { src: 'img/scroll-1.png' },
    { src: 'img/shield-1.png' },
    { src: 'img/sword-1.png' },
  ],

  /**
   * affiche le plateau de jeu
   */
  renderBoard: () => {
    app.shuffledCard = utils.shuffleCards(app.cards);
    // On boucle dans ce tableau pour créer une div carte qui va contenir 2 images (face-avant, face-arrière)
    app.shuffledCard.forEach((card) => {
      const newCard = document.createElement('div');
      newCard.className = 'card';
      newCard.id = card.id;

      // On accroche un eventListener au clique à chaque cartes
      newCard.addEventListener('click', app.flipAndSaveCard);

      // l'image de la face-avant de la carte
      const frontFace = document.createElement('img');
      frontFace.className = 'front-face';
      frontFace.alt = 'front face card';

      // l'image de la face arrière de la carte
      const backFace = document.createElement('img');
      backFace.className = 'back-face';
      backFace.src = 'img/cover.png';
      backFace.alt = 'back face card';

      // l'ajout des 2 faces dans la div.card
      newCard.append(frontFace);
      newCard.append(backFace);

      // On ajoute la div.card contenant la face avant et arrière dans la div.board
      app.board.append(newCard);
    });
  },

  /**
   * fonction pour reset le jeu et pouvoir rejouer une nouvelle partie
   */
  resetGame: () => {
    app.board.textContent = '';
    app.shuffledCard = null;
    app.choice = {
      firstCard: null,
      secondCard: null,
      selectedCards: [],
      foundedPair: [],
    };
    app.disabled = false;
    app.gameIsOver = {
      end: false,
      reason: '',
    };
  },

  flipAndSaveCard: (e) => {
    // Au clique, on retourne les cartes et on sauvegarde le/les choix seulement si on a pas déjà sélectionné 2 cartes
    if (!app.disabled) {
      const currentId = e.currentTarget.id;
      const currentCard = app.shuffledCard.find(
        (card) => card.id === Number(currentId)
      );

      app.flipCard(e, currentCard);
      app.setChoice(e, currentCard);
    }
  },

  flipCard: (e, currentCard) => {
    e.currentTarget.querySelector('.front-face').src = currentCard.src;
    e.currentTarget.classList.add('flipped');
    e.currentTarget.removeEventListener('click', app.flipAndSaveCard);
  },

  setChoice: (e, currentCard) => {
    app.choice.selectedCards.push(e.currentTarget);

    if (app.choice.firstCard) {
      app.choice.secondCard = currentCard;
    } else {
      app.choice.firstCard = currentCard;
    }

    /**
     * Si 2 cartes sont sélectionnées :
     *  - empêche de pouvoir en selectionnée une 3ème (ce qui écraserait la     sauvegarde de la 2ème)
     *  - lance la fonction pour vérifier la paire sauvegardée
     */
    if (app.choice.firstCard && app.choice.secondCard) {
      app.disabled = true;
      app.checkPair();
    }
  },

  /**
   * Fonction qui reset l'objet choice et la propriété disabled
   * pour pouvoir re-sélectionner une paire de carte
   */
  resetForNextTry: () => {
    app.choice = {
      ...app.choice,
      firstCard: null,
      secondCard: null,
      selectedCards: [],
    };

    app.disabled = false;
  },

  /**
   * fonction qui va vérifier la paire sélectionnée
   */
  checkPair: () => {
    // si la paire correspond
    if (app.choice.firstCard.src === app.choice.secondCard.src) {
      // on ajoute la paire au tableau qui comptabilise les paires trouvées
      app.choice.foundedPair.push(app.choice.selectedCards);
      // on supprime les listener des cartes pour ne plus pouvoir les sélectionner
      app.choice.selectedCards.forEach((card) => {
        card.removeEventListener('click', app.flipAndSaveCard);
        card.style.opacity = '0.5';
      });

      // on reset les valeurs de app.choice pour le prochain essai
      app.resetForNextTry();

      // on vérifie si le tableau de paires trouvé est aussi grand que le tableau de carte du jeux
      if (app.choice.foundedPair.length === app.cards.length) {
        // on rempli modifie l'objet gameIsOver pour une partie gagnée
        app.gameIsOver.end = true;
        app.gameIsOver.reason = 'all pairs founded';
        clearInterval(timer.interval);
        modals.hiddenInput.value = timer.timeSpent;
        app.winMessage.text = `C'est gagné en ${timer.timeSpent} secondes ! entrez votre pseudo pour rester à jamais dans l'histoire !`;
        app.endGame(app.winMessage);
      }
      // Si les 2 cartes ne correspondent pas :
    } else {
      /**
       *  - on attend 2sec pour retourner les cartes face cachée
       *  - on efface l'attribut src de la face-avant
       *  - puis on reset la propriété qui sauvegarde les 2 cartes à vérifier
       *  - puis on permet à nouveau de sélectionner 2 cartes
       */
      const callback = (e) => {
        e.target.removeAttribute('src');
        e.target.removeEventListener('transitionend', callback);
        e.currentTarget.parentNode.addEventListener(
          'click',
          app.flipAndSaveCard
        );
      };

      setTimeout(() => {
        app.choice.selectedCards.forEach((card) => {
          card
            .querySelector('.front-face')
            .addEventListener('transitionend', callback);
          card.classList.remove('flipped');
        });

        app.resetForNextTry();
      }, 1000);
    }
  },

  endGame: (message) => {
    modals.onEndGame(message);
  },

  listenerInit: () => {
    app.btnStart.addEventListener('click', () => {
      app.resetGame();
      app.renderBoard();
      modals.btnScoreBoard.style.display = 'none';

      if (timer.interval) {
        timer.restartTimer();
      } else {
        timer.init();
        timer.displayAndStartTimer();
      }
    });
  },

  createTd: (player, i) => {
    const tr = document.createElement('tr');
    const td_number = document.createElement('td');
    td_number.textContent = i + 1;
    const td_pseudo = document.createElement('td');
    td_pseudo.textContent = player.pseudo;
    const td_time = document.createElement('td');
    td_time.textContent =
      player.time > 1 ? `${player.time} secondes` : `${player.time} seconde`;

    tr.append(td_number, td_pseudo, td_time);

    document.querySelector('tbody').append(tr);
  },

  init: async () => {
    app.board = document.querySelector('.board');
    app.btnStart = document.querySelector('.start');
    modals.init();
    timer.init();
    app.listenerInit();

    try {
      const result = await fetch(
        'https://memory-back.herokuapp.com/get-scores'
      );
      const scores = await result.json();
      if (scores.length > 0) {
        modals.modalScoreBoard
          .querySelector('table')
          .classList.remove('disabled');

        scores
          .sort((a, b) => a.time - b.time)
          .forEach((score, i) => {
            app.createTd(score, i);
          });
      } else {
        modals.modalScoreBoard.querySelector('table').classList.add('disabled');
      }
    } catch (error) {
      const err = await error.json();
      console.log(err);
    }
  },
};

document.addEventListener('DOMContentLoaded', app.init);
