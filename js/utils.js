const utils = {
  /**
   * Fonction de mélange des cartes
   * @param {Array} cards - un tableau d'objet
   * @returns tableau de cartes mélangées
   */
  shuffleCards: (cards) => {
    // on retourne un tableau trié aléatoirement
    return (
      // on deverse 2x les cartes dans un tableau
      [...cards, ...cards]
        // on trie ce tableau aléatoirement
        .sort(() => Math.random() - 0.5)
        // on map dans ce tableau pour ajouter la propriété id à chaque éléments du tableau
        .map((card, i) => ({ ...card, id: i }))
    );
  },
};
