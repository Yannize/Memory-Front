const app = {
  // on initialise les propriétés qui nous seront utiles qui seront rempli dans la fonction app.init()
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
    // On mélange les cartes en stockant le résultat de la fonction utils.shuffleCards
    app.shuffledCard = utils.shuffleCards(app.cards);
    // On boucle dans ce tableau pour créer une div carte qui va contenir 2 images (face-avant, face-arrière)
    app.shuffledCard.forEach((card) => {
      // On crée une nouvelle carte avec une classe et une id à chaque itération de la boucle
      const newCard = document.createElement('div');
      newCard.className = 'card';
      newCard.id = card.id;

      // On accroche un eventListener au clique à chaque cartes
      newCard.addEventListener('click', app.flipAndSaveCard);

      // on crée la div image de la face-avant de la carte sans l'attribut src (pour ne pas pouvoir le voir avec l'inspecteur du navigateur, anti-triche)
      const frontFace = document.createElement('img');
      frontFace.className = 'front-face';
      frontFace.alt = 'front face card';

      // on crée la div image de la face arrière de la carte
      const backFace = document.createElement('img');
      backFace.className = 'back-face';
      backFace.src = 'img/cover.png';
      backFace.alt = 'back face card';

      // on append les 2 faces dans la div.card
      newCard.append(frontFace);
      newCard.append(backFace);

      // on append la div.card dans la div.board
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

  /**
   * Fonction qui retourne une carte et la sauvegarde dans une variable
   *
   * @param {Event} e - l'event obtenu après avoir cliqué sur une carte
   */
  flipAndSaveCard: (e) => {
    // si disable est à false
    if (!app.disabled) {
      // on stock l'id de la carte cliqué
      const currentId = e.currentTarget.id;
      // on cherche dans le tableau de cartes mélangées la carte cliqué
      const currentCard = app.shuffledCard.find(
        // en comparent la propriété id de l'objet carte avec l'id de la carte cliqué
        (card) => card.id === Number(currentId)
      );

      // lancement de la fonction pour retourner la carte
      app.flipCard(e, currentCard);

      // lancement de a fonction pour sauvegarder la carte
      app.setChoice(e, currentCard);
    }
  },

  /**
   * fonction pour retourner une carte face visible
   *
   * @param {Event} e - l'event obtenu après avoir cliqué sur une carte
   * @param {Object} currentCard - la carte trouvé dans le tableau de cartes mélangées
   */
  flipCard: (e, currentCard) => {
    // on rempli l'attribut src avec la propriété src de la carte cliqué pour que l'image s'affiche
    e.currentTarget.querySelector('.front-face').src = currentCard.src;
    // on ajoute la classe qui permettra au css de tourner la carte
    e.currentTarget.classList.add('flipped');
    // on retire l'écouter au clique pour ne pas pouvoir re-cliquer sur la même carte
    e.currentTarget.removeEventListener('click', app.flipAndSaveCard);
  },

  /**
   * fonction qui va stocker la/les carte/s cliquée/S
   *
   * @param {Event} e - l'event obtenu après avoir cliqué sur une carte
   * @param {Object} currentCard - la carte trouvé dans le tableau de cartes mélangées
   */
  setChoice: (e, currentCard) => {
    // on push la balise de la carte cliquée dans un tableau
    app.choice.selectedCards.push(e.currentTarget);

    // si une carte est déjà sauvegardé dans app.choice.firstCard
    if (app.choice.firstCard) {
      // c'est qu'on vient de cliquer sur la 2ème carte qu'on sauvegarde dans app.choice.secondCard
      app.choice.secondCard = currentCard;
      // sinon, c'est qu'on vient de cliquer sur la 1ère carte qu'on sauvegarde dans app.choice.firstCard
    } else {
      app.choice.firstCard = currentCard;
    }

    //Si 2 cartes sont sélectionnées :
    if (app.choice.firstCard && app.choice.secondCard) {
      // on empêche de pouvoir en selectionnée une autre carte (car ça écraserait la sauvegarde de la 2ème)
      app.disabled = true;
      // on lance la fonction pour vérifier la paire sauvegardée
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
      // on supprime les listeners des cartes vérifiées pour ne plus pouvoir les re-sélectionner jusqu'à la fin de la partie
      app.choice.selectedCards.forEach((card) => {
        card.removeEventListener('click', app.flipAndSaveCard);
        // on réduit leur opacité
        card.style.opacity = '0.5';
      });

      // on lance la fonction app.resetForNexTry
      app.resetForNextTry();

      // on vérifie si le tableau de paires trouvé est aussi grand que le tableau de carte du jeux
      if (app.choice.foundedPair.length === app.cards.length) {
        // on rempli l'objet gameIsOver pour une partie gagnée
        app.gameIsOver.end = true;
        app.gameIsOver.reason = 'all pairs founded';
        // on stop le décompte
        clearInterval(timer.interval);
        // on récupère le temps écoulé et on le met dans la value de l'input invisible qui permettra de sauvegardé le temps en bdd
        modals.hiddenInput.value = timer.timeSpent;
        // on rempli l'objet winMessage d'une string qui affichera le temps écoulé
        app.winMessage.text = `C'est gagné en ${timer.timeSpent} secondes ! entrez votre pseudo pour rester à jamais dans l'histoire !`;
        // on lance la fontion app.endGame en lui passant l'objet app.winMessage
        modals.onEndGame(app.winMessage);
      }
      // Si les 2 cartes ne correspondent pas :
    } else {
      /**
       * fonction qui sera éxécuté à la fin d'une transition CSS
       *
       * @param {Event} e - l'event obtenu à la détection d'une fin de transition
       */
      const callback = (e) => {
        // on retire l'attribut src de la carte pour ne pas pouvoir tricher avec l'inspecteur du navigateur
        e.target.removeAttribute('src');
        // on supprime le listener de fin de transition (pour éviter qu'il s'empile si on re-sélectionne la carte courrante plus tard)
        e.target.removeEventListener('transitionend', callback);
        // on raccroche un listener qui pourra relancer la fonction app.flipAndSaveCard au clique
        e.currentTarget.parentNode.addEventListener(
          'click',
          app.flipAndSaveCard
        );
      };

      /// on initialise un timeout qui éxécutera la fonction anonyme que est passé en argument après 1seconde.
      setTimeout(() => {
        //on boucle dans les 2 cartes sauvegardées
        app.choice.selectedCards.forEach((card) => {
          // on accroche un listener qui va détecter la fin d'une transition CSS pour lancer la fonction callback
          card
            .querySelector('.front-face')
            .addEventListener('transitionend', callback);
          // on enlève la classe flipped de la carte, ce qui va déclancher la transition
          card.classList.remove('flipped');
        });

        // on lance la fonction app.resetForNexTry
        app.resetForNextTry();
      }, 1000);
    }
  },

  /**
   * Fonction qui accroche un listener au bouton "nouvelle partie"
   */
  listenerInit: () => {
    app.btnStart.addEventListener('click', () => {
      // on reset le jeux (une 1ere fois puis à chaque fois qu'on reclick sur le bouton "nouvelle partie")
      app.resetGame();
      app.renderBoard();
      // on cache le bouton qui permet d'accéder au tableau des scores pendant la partie
      modals.btnScoreBoard.style.display = 'none';

      // si un setInterval était en train de tourner on lance la fonction timer.restartTimer
      if (timer.interval) {
        timer.restartTimer();
        // sinon on lance la fonction timer.displayAndStartTimer
      } else {
        timer.displayAndStartTimer();
      }
    });
  },

  /**
   * Fonction qui crée 3 td, les append dans un tr qui sera append dans le tbody de la table de score
   *
   * @param {Object} player - un objet contenant la position(number) le pseudo(string), le time(string)
   * @param {Number} i - l'itération en cours
   */
  createTd: (player, i) => {
    const tr = document.createElement('tr');
    const td_number = document.createElement('td');
    td_number.textContent = player.place;
    const td_pseudo = document.createElement('td');
    td_pseudo.textContent = player.pseudo;
    const td_time = document.createElement('td');
    // si le temps est supérieur à un "secondes"(pluriel) sinon "seconde"(singulier)
    td_time.textContent =
      player.time > 1 ? `${player.time} secondes` : `${player.time} seconde`;

    tr.append(td_number, td_pseudo, td_time);

    document.querySelector('tbody').append(tr);
  },

  /**
   * fonction qui se lance quand le DOM est chargé
   * asynchrone pour pouvoir attendre que les datas soit fetchés avant de passer à la suite du code
   */
  init: async () => {
    // On rempli les propriétés qui nous seront utiles
    app.board = document.querySelector('.board');
    app.btnStart = document.querySelector('.start');
    // On lance les fonctions d'initialisation des modules modals et timer
    modals.init();
    timer.init();
    // On lance la fonction qui va accrocher les listeners utiles
    app.listenerInit();

    // On essaie d'effectuer des opérations asynchrone
    try {
      // On fetch (si pas spécifié la methode est en GET, opération asynchrone, donc on await)
      const result = await fetch('https://memory-back.herokuapp.com/');
      // On converti le resultat en format JSON (opération asynchrone, donc on await)
      const scores = await result.json();
      // si la taille du tableau qu'on récupère est supérieur à 0, on affiche la le tableau de score dans la modale scoreBoard en lui retirant la classe disable
      // (on reste dans le try catch car les variables déclaré à l'intérieur y sont scopés)
      if (scores.length > 0) {
        modals.modalScoreBoard
          .querySelector('table')
          .classList.remove('disabled');

        // On boucle dans le tableau de score récupéré et on passe chaque objet
        scores.forEach((score) => {
          app.createTd(score);
        });
        // si le tableau n'est pas supérieur à 0, donc ne contient aucun élément, on empêche d'afficher le tableau de score dans la modale pour ne voir que le titre et le paragraphe d'accueil
      } else {
        modals.modalScoreBoard.querySelector('table').classList.add('disabled');
      }
      // Si une erreur survient, on l'attrappe et on la log dans la console.
    } catch (error) {
      console.log(err);
    }
  },
};

// le listener qui va attendre que le DOM se charge pour lancer la fonction app.init
document.addEventListener('DOMContentLoaded', app.init);
