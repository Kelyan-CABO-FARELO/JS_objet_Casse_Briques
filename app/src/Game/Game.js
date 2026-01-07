// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from '../assets/img/ball.png';

class Game {
    //Contexte de dessin du canvas
    ctx;

    // Images
    ballImg;

    //Temporaire: position de base de la balle
    ballX = 400;
    ballY = 300;
    ballSpeed = 5;
    ballVelocity = {
        x: this.ballSpeed * Math.cos(Math.PI / 6), // Trajectoire de la balle avec 30° d'angle (PI / 6)
        y:  this.ballSpeed * -1 * Math.sin(Math.PI/6)
    };


    start() {
        console.log('Jeu démarré ...');

        // Initialisation de l'interface HTML
        this.initHtmlUI();

        // Initialisation des objets du jeu
        this.initGameObjects();

        //Lancement de la boucle
        // bind.(this) sert à rattacher this.loop à la classe Game
        requestAnimationFrame(this.loop.bind(this));

        //Après la boucle

    }

    //Méthodes "privées"
    initHtmlUI() {

        const elH1 = document.createElement('h1');
        elH1.textContent = 'Casse Brique ! 🕹️';

        document.body.append(elH1);

        const elCanvas = document.createElement('canvas');
        elCanvas.width = 800;
        elCanvas.height = 600;

        document.body.append(elCanvas);

        // Récupération du contexte du dessin
        this.ctx = elCanvas.getContext('2d');
    }

    // Mise en place des objets du jeu sur la scene
    initGameObjects(){
        // 1- On crée une balise HTML <img> qui ne sera jamais ajouté au DOM
        this.ballImg = new Image();
        // 2- On récupère le nom de l'image généré par webpack en tant que src de cette image
        this.ballImg.src = ballImgSrc;
        // 3- On demande au contexte de dessin de dessiner cette image dans le canvas
        this.ctx.drawImage(this.ballImg, this.ballX, this.ballY);

    }

    // Boucle d'animation
    loop() {
        // Mise à jour de la position de la balle
        this.ballX += this.ballVelocity.x;
        this.ballY += this.ballVelocity.y;

        // Collision avec le côté droite ou gauche de la scène => Inversion du X de la vélocité
        if(this.ballX + 20 >= 800 || this.ballX <= 0) {
            this.ballVelocity.x *= -1
        }
        // Collision avec le côté haut ou bas de la scène => Inversion du Y de la vélocité
        if(this.ballY + 20 >= 600 || this.ballY <= 0) {
            this.ballVelocity.y *= -1
        }

        // ######## Rendu visuel #########
        // On efface tout le canvas
        this.ctx.clearRect(0, 0, 800, 600);
        //Dessin des objets
        this.ctx.drawImage(this.ballImg, this.ballX, this.ballY);

        // Appel de la frame suivante
        requestAnimationFrame(this.loop.bind(this));
    }

    // Fonction de test inutile dans le jeu
    // drawTest() {
    //     this.ctx.fillStyle = '#fc0';
    //     this.ctx.arc(400, 300, 100, Math.PI / 6, -Math.PI / 6);
    //     this.ctx.closePath();
    //     this.ctx.fill();
    // }
}

const theGame = new Game();

export default theGame;