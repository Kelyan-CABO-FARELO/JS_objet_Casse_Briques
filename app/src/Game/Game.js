// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from '../assets/img/ball.png';
import paddleImgSrc from '../assets/img/paddle.png';
import brickImgSrc from '../assets/img/brick.png';
import edgeImgSrc from '../assets/img/edge.png';
// Import des classes
import Ball from "./Ball";
import GameObject from "./GameObject";
import CollisionType from "./DataType/CollisionType";
import Paddle from "./Paddle";

class Game {
    //Contexte de dessin du canvas
    ctx;

    // Images
    images = {
        ball: null, paddle: null, brick: null, edge: null
    };
    // State (un objet qui décrit l'état actuel du jeu, les balles, les briques encore présentes, etc.)
    state = {
        // Balles (plusieurs car possibles multiball)
        balls: [],
        // Bordures de la mort
        deathEdge: null,
        // Bordures à rebond
        bouncingEdges: [],
        // Paddle
        paddle: null,
        // Entrées utilisateur
        userInput: {
            paddleLeft: false,
            paddleRight: false
        }
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

        // Écouteur d'événements du clavier
        document.addEventListener('keydown', this.handlerKeyboard.bind(this, true));
        document.addEventListener('keyup', this.handlerKeyboard.bind(this, false));
    }

    // Création des images
    initImages() {
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

        // Bordure
        const imgEdge = new Image();
        imgEdge.src = edgeImgSrc;
        this.images.edge = imgEdge;
    }

    // Mise en place des objets du jeu sur la scene
    initGameObjects() {
        // Balle
        const ball = new Ball(this.images.ball, 20, 20, 20, 7);
        ball.setPosition(400, 300);
        this.state.balls.push(ball);

        // Paddle
        const paddle = new Paddle(this.images.paddle, 100, 20, 0, 0);
        paddle.setPosition(350, 530);
        this.state.paddle = paddle;

        //Bordure de la mort
        const deathEdge = new GameObject(this.images.edge, 800, 20);
        deathEdge.setPosition(0, 630);
        this.state.deathEdge = deathEdge;

        // Bordures à rebond
        const edgeTop = new GameObject(this.images.edge, 800, 20);
        edgeTop.setPosition(0, 0);
        const edgeRight = new GameObject(this.images.edge, 20, 610);
        edgeRight.setPosition(780, 20);
        edgeRight.tag = 'RightEdge'
        const edgeLeft = new GameObject(this.images.edge, 20, 610);
        edgeLeft.setPosition(0, 20);
        edgeLeft.tag = 'LeftEdge'
        this.state.bouncingEdges.push(edgeTop, edgeRight, edgeLeft);

    }


    // Boucle d'animation
    loop() {
        // On efface tout le canvas
        this.ctx.clearRect(0, 0, 800, 600);

        // Dessin des bordures à rebond
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });

        // Cycle du paddle
        // On analyse quelles commandes de mouvement est demandée pour le paddle
        // Droite
        if (this.state.userInput.paddleRight) {
            this.state.paddle.orientation = 0;
            this.state.paddle.speed = 7;
        }

        // Gauche
        if (this.state.userInput.paddleLeft) {
            this.state.paddle.orientation = 180;
            this.state.paddle.speed = 7;
        }

        // Ni Droite Ni Gauche
        if (!this.state.userInput.paddleLeft && !this.state.userInput.paddleRight) {
            this.state.paddle.speed = 0;
        }

        //Mise à jour de la position
        this.state.paddle.update();

        // Dessin du paddle
        // Collision du paddle avec les bords
        this.state.bouncingEdges.forEach(theEdge => {
            const collisionType = this.state.paddle.getCollisionType(theEdge);

            //? Si aucune collision ou autre eque horizontal, on passe au edge suivant
            if(collisionType !== CollisionType.HORIZONTAL) return;

            //? Si la collision est horizontale, on arrête la vitesse du paddle
            this.state.paddle.speed = 0;

            // On récupère les limites de theEdge
            const edgeBounds = theEdge.getBounds();
            //? Si on a touché la bordure de droite
            if(theEdge.tag === "RightEdge") {
                this.state.paddle.position.x = edgeBounds.left - 1 - this.state.paddle.size.width;
            }
            //? Si on a touché la bordure de gauche
            if(theEdge.tag === "LeftEdge") {
                this.state.paddle.position.x = edgeBounds.right + 1
            }
            // On remet à jour le paddle
            this.state.paddle.update();
        });
        this.state.paddle.draw();

        //Cycles des balles
        // On crée un tableau pour stocker les balles non-perdues
        const savedBalls = [];

        this.state.balls.forEach(theBall => {
            theBall.update();

            // Collision de la balle avec le bord de la mort
            if (theBall.getCollisionType(this.state.deathEdge) !== CollisionType.NONE) {
                // On enlève la balle du state
                return;
            }

            // Collision de la balle avec le paddle
            if (theBall.getCollisionType(this.state.paddle) !== CollisionType.NONE) {
                const collisionType = theBall.getCollisionType(this.state.paddle);

                switch (collisionType) {
                    case CollisionType.NONE:
                        return;
                    case CollisionType.HORIZONTAL:
                        theBall.reverseOrientationX();
                        break;
                    case CollisionType.VERTICAL:
                        theBall.reverseOrientationY();
                        break;
                    default:
                        break;
                }
            }

            // On sauvegarde la balle en cours (car si on est là, c'est qu'on a pas tapé le bord de la mort)
            savedBalls.push(theBall);

            // Collisions de la balle avec les bords rebondissants
            this.state.bouncingEdges.forEach(theEdge => {
                const collisionType = theBall.getCollisionType(theEdge);

                switch (collisionType) {
                    case CollisionType.NONE:
                        return;
                    case CollisionType.HORIZONTAL:
                        theBall.reverseOrientationX();
                        break;
                    case CollisionType.VERTICAL:
                        theBall.reverseOrientationY();
                        break;
                    default:
                        break;
                }
            });

            // Dessin de la balle
            theBall.draw();
        });

        // Mise à jour du state.balls avec savedBalls
        this.state.balls = savedBalls;

        //? S'il n'y a aucune balle dans savedBalls, on a perdu
        if (savedBalls <= 0) {
            console.log("NUUUUUUUULLLLL !!!!");
            // On sort de la boucle loop()
            return
        }

        // Appel de la frame suivante
        requestAnimationFrame(this.loop.bind(this));
    }

    // Gestionnaire d'événement DOM
    handlerKeyboard(isActive, evt) {

        // Flèche droite
        if (evt.key === 'Right' || evt.key === 'ArrowRight') {
            //? Si on souhaite activer "droite" mais que gauche est déjà activé, on désactive gauche
            if (isActive && this.state.userInput.paddleLeft)
                this.state.userInput.paddleLeft = false;

            this.state.userInput.paddleRight = isActive;
        }
        // Flèche gauche
        else if (evt.key === 'Left' || evt.key === 'ArrowLeft') {
            //? Si on souhaite activer "gauche" mais que droite est déjà activé, on désactive droite
            if (isActive && this.state.userInput.paddleRight)
                this.state.userInput.paddleRight = false;

            this.state.userInput.paddleLeft = isActive;
        }
    }
}

const theGame = new Game();

export default theGame;