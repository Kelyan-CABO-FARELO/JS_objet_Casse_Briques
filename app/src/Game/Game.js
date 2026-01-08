// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from '../assets/img/ball.png';
import paddleImgSrc from '../assets/img/paddle.png';
import brickImgSrc from '../assets/img/brick.png';
import Ball from "./Ball";

class Game {
    //Contexte de dessin du canvas
    ctx;

    // Images
    images = {
        ball: null,
        paddle: null,
        brick: null
    };
    // State (un objet qui décrit l'état actuel du jeu, les balles, les briques encore présentes, etc.)
    state = {
        // Balles (plusieurs car possibles multiball)
        balls: [],
        // Paddle
        paddle: null
    };


    start() {
        console.log('Jeu démarré ...');

        // Initialisation de l'interface HTML
        this.initHtmlUI();

        // Initialisation des images
        this.initImages();

        // Initialisation des objets du jeu
        this.initGameObjects();

        //Lancement de la boucle
        //* bind.(this) sert à rattacher thi6s.loop à la classe Game
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

    // Création des images
    initImages(){
        // Balle
        const imgBall = new Image();
        imgBall.src = ballImgSrc;
        this.images.ball = imgBall;

        // Paddle
        const imgPaddle = new Image();
        imgPaddle.src = paddleImgSrc;
        this.images.paddle = imgPaddle;

        // Brique
        const imgBrik = new Image();
        imgBrik.src = brickImgSrc;
        this.images.brick = imgBrik;
    }

    // Mise en place des objets du jeu sur la scene
    initGameObjects(){
        // Balle
        const ball = new Ball(this.images.ball, 20, 20, 20, 10);
        ball.setPosition(400, 300);
        this.state.balls.push(ball);
        // Dessin des balles
        this.state.balls.forEach(theBall => {
            theBall.draw();
        });

    }


    // Boucle d'animation
    loop() {
        // On efface tout le canvas
        this.ctx.clearRect(0, 0, 800, 600);
        //Cycles des balles
        this.state.balls.forEach(theBall => {
            theBall.update();

            const bounds = theBall.getBounds();

            // Todo: en mieux: Détection des collisions

            // Collision avec le côté droit ou gauche de la scène : inversion du x de la vélocité
            if (bounds.right >= 800 || bounds.left <= 0) {
                theBall.reverseOrientationX();
            }
            //Collision avec le côté haut ou bas de la scène : inversion du y de la vélocité
            if (bounds.bottom >= 600 || bounds.top <= 0) {
                theBall.reverseOrientationY();
            }

            theBall.draw();
        });
        // Appel de la frame suivante
        requestAnimationFrame(this.loop.bind(this));
    }

    // Fonction de test inutile dans le jeu (ex : de comment dessiner la balle)
    // drawTest() {
    //     this.ctx.fillStyle = '#fc0';
    //     this.ctx.arc(400, 300, 100, Math.PI / 6, -Math.PI / 6);
    //     this.ctx.closePath();
    //     this.ctx.fill();
    // }
}

const theGame = new Game();

export default theGame;