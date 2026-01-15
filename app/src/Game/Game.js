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
import Edge from "./Edge";

class Game {

    config = {
        canvasSize: {
            width: 800,
            height: 600
        },
        ball: {
            radius: 10,
            speed: 8,
            angleAlteration: 30
        },
        paddleSize: {
            width: 800,
            height: 20
        }
    }

    levels;
    score = 0;
    spanScore;
    currentLevelIndex = 0;
    ctx;

    images = {
        ball: null, paddle: null, brick: null, edge: null
    };
    state = {
        balls: [],
        bricks: [],
        deathEdge: null,
        bouncingEdges: [],
        paddle: null,
        userInput: {
            paddleLeft: false,
            paddleRight: false
        }
    };

    constructor(customConfig = {}, levelsConfig = []) {
        Object.assign(this.config, customConfig);
        this.levels = levelsConfig
    }


    start() {
        console.log('Jeu démarré ...');
        this.initHtmlUI();
        this.initImages();
        this.initGameObjects();
        requestAnimationFrame(this.loop.bind(this));
    }

    initHtmlUI() {
        const elH1 = document.createElement('h1');
        elH1.textContent = 'Casse Brique !️';

        // Création d'un conteneur pour le score pour un meilleur style
        const scoreContainer = document.createElement('div');
        scoreContainer.textContent = 'Score: ';
        this.spanScore = document.createElement('span');
        this.spanScore.textContent = this.score;
        scoreContainer.appendChild(this.spanScore);

        const elCanvas = document.createElement('canvas');
        elCanvas.width = this.config.canvasSize.width;
        elCanvas.height = this.config.canvasSize.height;

        document.body.append(elH1, scoreContainer, elCanvas);

        this.ctx = elCanvas.getContext('2d');

        document.addEventListener('keydown', this.handlerKeyboard.bind(this, true));
        document.addEventListener('keyup', this.handlerKeyboard.bind(this, false));
    }

    // Méthode pour mettre à jour le score
    updateScore(points) {
        this.score += points;
        this.spanScore.textContent = this.score;
    }

    initImages() {
        const imgBall = new Image();
        imgBall.src = ballImgSrc;
        this.images.ball = imgBall;

        const imgPaddle = new Image();
        imgPaddle.src = paddleImgSrc;
        this.images.paddle = imgPaddle;

        const imgBrik = new Image();
        imgBrik.src = brickImgSrc;
        this.images.brick = imgBrik;

        const imgEdge = new Image();
        imgEdge.src = edgeImgSrc;
        this.images.edge = imgEdge;
    }

    initGameObjects() {
        const paddle = new Paddle(
            this.images.paddle,
            this.config.paddleSize.width,
            this.config.paddleSize.height,
            0, 0);
        paddle.setPosition((this.config.canvasSize.width / 2) - (this.config.paddleSize.width / 2),
            this.config.canvasSize.height - this.config.paddleSize.height - 20);
        this.state.paddle = paddle;

        const deathEdge = new GameObject(this.images.edge, this.config.canvasSize.width, 20);
        deathEdge.setPosition(0, this.config.canvasSize.height + 30);
        this.state.deathEdge = deathEdge;

        const edgeTop = new Edge(this.images.edge, this.config.canvasSize.width, 20);
        edgeTop.setPosition(0, 0);
        const edgeRight = new Edge(this.images.edge, 20, this.config.canvasSize.height + 10);
        edgeRight.setPosition(this.config.canvasSize.width - 20, 0);
        edgeRight.tag = 'RightEdge'
        const edgeLeft = new Edge(this.images.edge, 20, this.config.canvasSize.height + 10);
        edgeLeft.setPosition(0, 0);
        edgeLeft.tag = 'LeftEdge'
        this.state.bouncingEdges.push(edgeTop, edgeRight, edgeLeft);

        this.loadLevel(this.currentLevelIndex);
    }

    loadLevel(levelIndex) {
        this.state.bricks = [];
        this.state.balls = [];

        const levelData = this.levels.data[levelIndex];
        if (!levelData) {
            console.log("VOUS AVEZ GAGNÉ !");
            elH1.textContent = `Victoire ! Score final : ${this.score}`;
            return;
        }
        this.loadBricks(levelData);

        const paddle = this.state.paddle;
        const randomAngle = Math.floor(Math.random() * 120) + 31;
        const ballDiameter = this.config.ball.radius * 2;
        const ball = new Ball(this.images.ball, ballDiameter, ballDiameter, randomAngle, this.config.ball.speed);
        const ballX = paddle.position.x + (paddle.size.width / 2) - (ball.size.width / 2);
        const ballY = paddle.position.y - ball.size.height - 5;
        ball.setPosition(ballX, ballY);
        ball.isCircular = true;
        this.state.balls.push(ball);
    }

    loadBricks(levelArray) {
        for (let line = 0; line < levelArray.length; line++) {
            for (let column = 0; column < levelArray[line].length; column++) {
                let brickType = levelArray[line][column];
                if (brickType === 0) continue;

                const brik = new Brik(this.images.brick, 50, 25, brickType);
                brik.setPosition(20 + (50 * column), 20 + (25 * line));
                this.state.bricks.push(brik);
            }
        }
    }

    checkUserInput() {
        const paddle = this.state.paddle;
        const wallSize = 20;
        const canvasWidth = this.config.canvasSize.width;

        if (this.state.userInput.paddleRight) {
            if (paddle.position.x + paddle.size.width + paddle.speed > canvasWidth - wallSize) {
                paddle.position.x = canvasWidth - wallSize - paddle.size.width;
                paddle.speed = 0;
            } else {
                paddle.orientation = 0;
                paddle.speed = 7;
            }
        } else if (this.state.userInput.paddleLeft) {
            if (paddle.position.x - paddle.speed < wallSize) {
                paddle.position.x = wallSize;
                paddle.speed = 0;
            } else {
                paddle.orientation = 180;
                paddle.speed = 7;
            }
        } else {
            paddle.speed = 0;
        }
        paddle.update();
    }

    checkCollisions() {
        const savedBalls = [];
        this.state.balls.forEach(theBall => {
            if (theBall.getCollisionType(this.state.deathEdge) !== CollisionType.NONE) {
                return;
            }
            savedBalls.push(theBall);

            this.state.bouncingEdges.forEach(theEdge => {
                const collisionType = theBall.getCollisionType(theEdge);
                if (collisionType === CollisionType.HORIZONTAL) theBall.reverseOrientationX();
                else if (collisionType === CollisionType.VERTICAL) theBall.reverseOrientationY();
            });

            this.state.bricks.forEach(theBrick => {
                const collisionType = theBall.getCollisionType(theBrick);
                if (collisionType !== CollisionType.NONE) {
                    if (collisionType === CollisionType.HORIZONTAL) theBall.reverseOrientationX();
                    else theBall.reverseOrientationY();
                    theBrick.strength --;

                    // Utilisation de la nouvelle méthode
                    if (theBrick.strength === 0) {
                        this.updateScore(theBrick.type);
                    }
                }
            });

            const paddleCollisionType = theBall.getCollisionType(this.state.paddle);
            if (paddleCollisionType === CollisionType.VERTICAL) {
                let alteration = 0;
                if (this.state.userInput.paddleRight) alteration = -1 * this.config.ball.angleAlteration;
                else if (this.state.userInput.paddleLeft) alteration = this.config.ball.angleAlteration;
                theBall.reverseOrientationY(alteration);

                if (theBall.orientation === 0) theBall.orientation = 10;
                else if (theBall.orientation === 180) theBall.orientation = 170;
            } else if (paddleCollisionType === CollisionType.HORIZONTAL) {
                theBall.reverseOrientationX();
            }
        });
        this.state.balls = savedBalls;
    }

    updateObjects() {
        this.state.balls.forEach(theBall => theBall.update());
        this.state.bricks = this.state.bricks.filter(theBrick => theBrick.strength !== 0);

        if (this.state.bricks.length === 0) {
            this.currentLevelIndex++;
            this.loadLevel(this.currentLevelIndex);
        }
    }

    renderObjects() {
        this.ctx.clearRect(0, 0, this.config.canvasSize.width, this.config.canvasSize.height);
        this.state.bouncingEdges.forEach(theEdge => theEdge.draw());
        this.state.bricks.forEach(theBrick => theBrick.draw());
        this.state.paddle.draw();
        this.state.balls.forEach(theBall => theBall.draw());
    }

    loop() {
        this.checkUserInput();
        this.checkCollisions();
        this.updateObjects();
        this.renderObjects();

        if (this.state.balls.length <= 0 && this.state.bricks.length > 0) {
            console.log("Kaboooooooom !!!");
            // Idéalement, afficher un écran de Game Over ici
            return;
        }
        
        if(this.levels.data[this.currentLevelIndex] || this.state.bricks.length > 0) {
            requestAnimationFrame(this.loop.bind(this));
        }
    }

    handlerKeyboard(isActive, evt) {
        if (evt.key === 'Right' || evt.key === 'ArrowRight') {
            if (isActive && this.state.userInput.paddleLeft) this.state.userInput.paddleLeft = false;
            this.state.userInput.paddleRight = isActive;
        } else if (evt.key === 'Left' || evt.key === 'ArrowLeft') {
            if (isActive && this.state.userInput.paddleRight) this.state.userInput.paddleRight = false;
            this.state.userInput.paddleLeft = isActive;
        }
    }
}

const theGame = new Game(customConfig, levelsConfig);
export default theGame;