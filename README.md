# 🚀 Casse-Briques 🚀

Bienvenue dans Casse-Briques, une réinterprétation moderne et riche en fonctionnalités du jeu d'arcade classique, entièrement développée en JavaScript orienté objet. Préparez-vous à une expérience de jeu dynamique avec des bonus, des malus, et plusieurs modes de jeu.

![Gameplay](/app/src/assets/img/Gameplay_jeu.png)
---

## 🌟 Fonctionnalités Actuelles

*   **Moteur de Jeu Orienté Objet :** Une structure de code propre où chaque élément (balle, paddle, brique) est une classe indépendante, facilitant la maintenance et l'ajout de nouvelles fonctionnalités.
*   **Système de Niveaux :** Charge des niveaux prédéfinis depuis un fichier `levels.json`.
*   **Types de Briques Variés :**
    *   **Briques Classiques :** Avec différents niveaux de résistance selon leur type.
    *   **Briques Incassables (`-1`) :** Des obstacles indestructibles pour pimenter le défi.
    *   **Super Briques (`S`) :** Détruisez-les pour libérer un bonus (ou malus) aléatoire !
*   **Arsenal de Bonus & Malus :**
    *   💥 **Multiball :** Libère une pluie de 5 nouvelles balles !
    *   ↔️ **Paddle Agrandit :** Augmente la taille de votre paddle pendant 10 secondes.
    *   ➡️⬅️ **Paddle Rétrécit :** Réduit la taille de votre paddle pendant 10 secondes.
    *   🔥 **Balle Perforante :** Traverse les briques sans rebondir pendant 10 secondes.
    *   ✨ **Paddle Collant :** Attrapez la balle et relancez-la au moment parfait avec la barre d'espace.
    *   🔫 **Laser :** Vous donne 3 tirs de laser à déclencher avec la barre d'espace.
*   **Modes de Jeu :**
    *   **1 Joueur :** Le mode arcade classique avec un système de vies et de score.
    *   **2 Joueurs (Tour par Tour) :** Affrontez un ami ! Chaque joueur joue jusqu'à perdre une vie, puis c'est au tour du suivant. Les scores sont conservés et comparés à la fin.
*   **Expérience de Jeu Soignée :**
    *   **Écran d'Accueil en Modale :** Le jeu démarre avec une modale pour choisir le mode et le niveau de départ.
    *   **Compte à Rebours :** Un timer "3, 2, 1, GO!" se lance avant chaque début de partie, après avoir perdu une vie ou lors d'un changement de joueur, pour laisser le temps de se préparer.
    *   **Machine à États :** Le jeu est géré par une machine à états (`MENU`, `COUNTDOWN`, `PLAYING`, `GAME_OVER`) pour un contrôle propre du déroulement de la partie.
    *   **Écrans de Fin :** Des modales claires pour les écrans de "Victoire" et de "Game Over", avec un résumé des scores et un bouton pour rejouer.

---

## 🛠️ Installation et Lancement

Ce projet utilise `webpack` pour gérer les modules JavaScript et le serveur de développement.

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
    *   **Placement :** Cliquez sur le canevas pour placer les briques (1 coups -> 2 coups -> 3 coups -> 4 coups -> Bonus -> incassables)
3.  **Sauvegarde :**
    *   Cliquez sur "Sauvegarder et Jouer". Votre niveau est maintenant stocké dans votre navigateur et lance la partie !
    * ATTENTION !! Si vous recréez un niveaux le dernier sera supprimé
4.  **Jouer :**
    *   Depuis l'écran d'accueil, vous trouverez un bouton "Jouer niveau Perso" cliquez dessus et c'est le dernier niveaux personnalisé enregistré qui va se lancer.

---

## 💻 Pour les Développeurs : Structure du Code

Le projet est structuré autour de classes JavaScript pour une meilleure organisation et modularité.

*   **`Game.js` :** Le cœur du jeu. Il contient la boucle principale (`loop`), la machine à états (`GameState`), et gère l'interaction entre tous les objets du jeu.
*   **`GameObject.js` :** La classe de base pour tous les objets visibles à l'écran (gère la position, la taille, et l'image).
*   **`MovingObject.js` :** Hérite de `GameObject` et ajoute la logique de mouvement (vitesse, orientation).
*   **`Ball.js`, `Paddle.js`, `Brik.js`, `Bonus.js`, `Laser.js` :** Des classes spécifiques qui héritent de `GameObject` ou `MovingObject` et implémentent leur propre logique de dessin et de comportement.
*   **`levels.json` :** Contient les données des niveaux prédéfinis sous forme de tableaux 2D, où chaque nombre représente un type de brique.

---

## 🔮 Améliorations Futures Possibles

*   Finaliser l'éditeur de niveaux.
*   Ajouter des effets sonores pour les collisions, les bonus et la musique de fond.
*   Créer plus de types de bonus (vie supplémentaire, balle lente, etc.).
*   Afficher le nombre de munitions laser à l'écran.

Amusez-vous bien !
