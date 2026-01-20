# 🚀 Casse-Briques Pro 🚀

Bienvenue dans Casse-Briques Pro, une réinterprétation moderne et riche en fonctionnalités du jeu d'arcade classique, entièrement développée en JavaScript orienté objet. Préparez-vous à une expérience de jeu dynamique avec des bonus, des malus, plusieurs modes de jeu et même un éditeur de niveaux intégré !

![Gameplay](/app/src/assets/img/Gameplay_jeu.png)

---

## 🌟 Fonctionnalités

Ce n'est pas le casse-briques de votre enfance ! Découvrez une liste de fonctionnalités conçues pour une rejouabilité maximale :

*   **Moteur Physique Orienté Objet :** Une structure de code propre et modulaire où chaque élément (balle, paddle, brique) est un objet indépendant.
*   **Système de Niveaux :** Chargez des niveaux prédéfinis depuis un fichier `levels.json` facile à éditer.
*   **Types de Briques Variés :**
    *   **Briques Classiques :** Avec différents niveaux de résistance.
    *   **Briques Incassables :** Des obstacles indestructibles pour pimenter le défi.
    *   **Super Briques :** Détruisez-les pour libérer des bonus aléatoires !
*   **Arsenal de Bonus & Malus :**
    *   💥 **Multiball :** Libère une pluie de 5 nouvelles balles !
    *   ↔️ **Paddle Agrandit :** Augmente la taille de votre paddle pendant 10 secondes.
    *   ➡️⬅️ **Paddle Rétrécit :** Réduit la taille de votre paddle pendant 10 secondes.
    *   🔥 **Balle Perforante :** Traverse les briques sans rebondir pendant 10 secondes.
    *   ✨ **Paddle Collant :** Attrapez la balle et relancez-la au moment parfait avec la barre d'espace.
    *   🔫 **Laser :** Vous donne 3 tirs de laser à déclencher avec la barre d'espace.
*   **Modes de Jeu :**
    *   **1 Joueur :** Le mode arcade classique.
    *   **2 Joueurs (Tour par Tour) :** Affrontez un ami ! Chaque joueur joue jusqu'à perdre une vie.
*   **Éditeur de Niveaux :**
    *   Créez vos propres niveaux directement dans le jeu.
    *   Sauvegardez et chargez vos créations grâce au `localStorage` de votre navigateur.
*   **Expérience de Jeu Soignée :**
    *   Écran d'accueil avec sélection du mode et du niveau.
    *   Compte à rebours avant chaque début de partie pour vous laisser le temps de vous préparer.
    *   Système de vies et de score.
    *   Écrans de Victoire et de Game Over.

---

## 🛠️ Installation et Lancement

Ce projet utilise `webpack` pour gérer les modules JavaScript.

1.  **Installez les dépendances :**
    ```bash
    npm install
    ```
2.  **Lancez le serveur de développement :**
    ```bash
    npm start
    ```
3.  Ouvrez votre navigateur et allez à l'adresse indiquée (généralement `http://localhost:8080`).

---

## 🎮 Comment Jouer

### Contrôles
*   **Flèche Gauche / Droite :** Déplacer le paddle.
*   **Barre d'Espace :**
    *   Relancer la balle si elle est collée au paddle (Bonus *Paddle Collant*).
    *   Tirer un laser si le bonus est actif.

### Objectif
Détruisez toutes les briques cassables pour passer au niveau suivant. Survivez le plus longtemps possible et visez le meilleur score !

---

## 🎨 Éditeur de Niveaux

Libérez votre créativité avec l'éditeur de niveaux intégré !

1.  **Accès :** Depuis l'écran d'accueil, cliquez sur le bouton "Éditeur de Niveaux".
2.  **Création :**
    *   **Palette d'outils :** Une barre d'outils apparaît, vous permettant de sélectionner un type de brique (Normale, Incassable, Super Brique) ou l'effaceur.
    *   **Placement :** Cliquez sur le canevas pour placer la brique sélectionnée. Vous pouvez maintenir le clic et glisser pour "peindre" des briques.
    *   **Effacement :** Sélectionnez l'effaceur et cliquez sur les briques que vous souhaitez retirer.
3.  **Sauvegarde :**
    *   Donnez un nom à votre niveau dans le champ de texte prévu.
    *   Cliquez sur "Sauvegarder". Votre niveau est maintenant stocké dans votre navigateur !
4.  **Jouer :**
    *   Depuis l'écran d'accueil, vos niveaux personnalisés apparaîtront dans le sélecteur de niveaux, prêts à être joués en mode 1 ou 2 joueurs.

---

## 💻 Pour les Développeurs : Structure du Code

Le projet est structuré autour de classes JavaScript pour une meilleure organisation.

*   **`Game.js` :** Le cœur du jeu. Il contient la boucle principale (`loop`), la machine à états (`GameState`), et gère l'interaction entre tous les objets.
*   **`GameObject.js` :** La classe de base pour tous les objets visibles à l'écran (position, taille, image).
*   **`MovingObject.js` :** Hérite de `GameObject` et ajoute la logique de mouvement (vitesse, orientation).
*   **`Ball.js`, `Paddle.js`, `Brik.js`, `Bonus.js`, `Laser.js` :** Des classes spécifiques qui héritent de `GameObject` ou `MovingObject` et implémentent leur propre logique de dessin et de comportement.
*   **`levels.json` :** Contient les données des niveaux prédéfinis sous forme de tableaux 2D.
*   **`localStorage` :** Utilisé pour la persistance des niveaux personnalisés créés par l'utilisateur.

---

## 🔮 Améliorations Futures Possibles

*   Ajouter des effets sonores pour les collisions, les bonus et la musique de fond.
*   Créer plus de types de bonus (balle de feu, vie supplémentaire, etc.).
*   Ajouter des boss de fin de niveau.
*   Améliorer l'interface de l'éditeur avec plus d'options.

Amusez-vous bien !