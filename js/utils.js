const utils = {
  /**
   * Fonction de mélange des cartes
   * @returns tableau de cartes mélangées
   */
  shuffleCards: (cards) => {
    // on deverse 2x les cartes dans un tableau et on les tries de façon aléatoire
    // on retourn ce tableau de carte mélangé
    return [...cards, ...cards]
      .sort(() => Math.random() - 0.49)
      .map((card, i) => ({ ...card, id: i }));
  },
};
