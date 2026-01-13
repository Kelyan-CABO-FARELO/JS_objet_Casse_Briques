// Import de la feuille de style
import '../assets/css/style.css';
// Import des données de configuration
import customConfig from '../config.json';
import levelsConfig from '../levels.json';
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
import Brik from "./Brik";

class Game {

    config = {
        canvasSize: {
            width: 800,
            height: 600
        },
        ball: {
            radius: 10,
            orientation: 45,
            speed: 5,
            position: {
                x: 400,
                y: 300
            },
            angleAlteration: 30
        },
        paddleSize: {
            width: 100,
            height: 20
        }
    }

    levels;
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
        // Briques
        bricks: [],
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

    constructor(customConfig = {}, levelsConfig = []) {
        // Object.assign() permet de fusionner des objets littéraux (seulement le premier niveau
        Object.assign(this.config, customConfig);

        this.levels = levelsConfig
    }


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
        elCanvas.width = this.config.canvasSize.width;
        elCanvas.height = this.config.canvasSize.height;

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
        const ballDiameter = this.config.ball.radius * 2
        const ball = new Ball(
            this.images.ball,
            ballDiameter,
            ballDiameter,
            this.config.ball.orientation,
            this.config.ball.speed);
        ball.setPosition(this.config.ball.position.x, this.config.ball.position.y);
        ball.isCircular = true;
        this.state.balls.push(ball);

        // Paddle
        const paddle = new Paddle(
            this.images.paddle,
            this.config.paddleSize.width,
            this.config.paddleSize.height,
            0, 0);
        paddle.setPosition((this.config.canvasSize.width / 2) - (this.config.paddleSize.width / 2),
            this.config.canvasSize.height - this.config.paddleSize.height - 20);
        this.state.paddle = paddle;

        //Bordure de la mort (Bordure du bas)
        const deathEdge = new GameObject(this.images.edge, this.config.canvasSize.width, 20);
        deathEdge.setPosition(0, this.config.canvasSize.height + 30);
        this.state.deathEdge = deathEdge;

        // Bordures à rebond
        // Haut
        const edgeTop = new GameObject(this.images.edge, this.config.canvasSize.width, 20);
        edgeTop.setPosition(0, 0);

        // Droite
        const edgeRight = new GameObject(this.images.edge, 20, this.config.canvasSize.height + 10);
        edgeRight.setPosition(this.config.canvasSize.width - 20, 20);
        edgeRight.tag = 'RightEdge'

        // Gauche
        const edgeLeft = new GameObject(this.images.edge, 20, this.config.canvasSize.height + 10);
        edgeLeft.setPosition(0, 20);
        edgeLeft.tag = 'LeftEdge'
        this.state.bouncingEdges.push(edgeTop, edgeRight, edgeLeft);

        // Chargement des briques
        this.loadBricks(this.levels.data[0]);

    }

    // Création des briques
    loadBricks(levelArray){
        // LIGNE
        for(let line = 0; line < levelArray.length; line ++){
            // COLONNES
            for(let column = 0; column < levelArray[line].length; column ++){
                let brickType = levelArray[line][column];
                //? Si la valeur trouvée est 0, c'est un espace vide, donc on passe à la colonne suivante
                if(brickType === 0) continue;

                //? Si on a bien une brique, on la crée et on la met dans state
                const brik = new Brik(this.images.brick, 50, 25, brickType);
                brik.setPosition(20 + (50 * column), 20 + (25 * line));

                this.state.bricks.push(brik);
            }
        }
    }


    // Boucle d'animation
    loop() {
        // On efface tout le canvas
        this.ctx.clearRect(0, 0, this.config.canvasSize.width, this.config.canvasSize.height);

        // Dessin des bordures à rebond
        this.state.bouncingEdges.forEach(theEdge => {
            theEdge.draw();
        });

        // Dessin des briques
        this.state.bricks.forEach(theBrick => {
            theBrick.draw();
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
        // Dessin du paddle
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
                        let alteration = 0;

                        //? Altération de l'angle en fonction du mouvement du paddle
                        if(this.state.userInput.paddleRight)
                            alteration = -1 * this.config.ball.angleAlteration;
                        else if(this.state.userInput.paddleLeft)
                            alteration = this.config.ball.angleAlteration;

                        theBall.reverseOrientationY(alteration);

                        //? Correction de l'angle si la balle arrive exactement à l'horizontale(0 et 180°) et reste bloqué
                        if(theBall.orientation === 0)
                            theBall.orientation = 10;
                        else if(theBall.orientation === 180)
                            theBall.orientation = 170;

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

const theGame = new Game(customConfig, levelsConfig);

export default theGame;