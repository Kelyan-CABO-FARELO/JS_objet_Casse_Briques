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
import incassableBrickImgSrc from '../assets/img/brick-1.png';
import superBrickImgSrc from '../assets/img/brickS.png';

// Import des classes
import Ball from "./Ball";
import GameObject from "./GameObject";
import CollisionType from "./DataType/CollisionType";
import Paddle from "./Paddle";
import Brik from "./Brik";
import Edge from "./Edge";
import Bonus, {BonusType} from "./Bonus";

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
        ball: null, paddle: null, brick: null, edge: null, incassableBrick: null, superBrick: null, bonus: null
    };
    state = {
        balls: [],
        bricks: [],
        bonuses: [],
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

    updateScore(points) {
        this.score += points;
        this.spanScore.textContent = this.score;
    }

    initImages() {
        // Chargement de l'image de la balle
        const imgBall = new Image();
        imgBall.src = ballImgSrc;
        this.images.ball = imgBall;

        // Chargement de l'image du paddle
        const imgPaddle = new Image();
        imgPaddle.src = paddleImgSrc;
        this.images.paddle = imgPaddle;

        // Chargement de l'image de la brique
        const imgBrik = new Image();
        imgBrik.src = brickImgSrc;
        this.images.brick = imgBrik;

        // Chargement de l'image des bords
        const imgEdge = new Image();
        imgEdge.src = edgeImgSrc;
        this.images.edge = imgEdge;

        // Chargement de l'image de la brique incassable
        const imgIncassableBrick = new Image();
        imgIncassableBrick.src = incassableBrickImgSrc;
        this.images.incassableBrick = imgIncassableBrick;

        // Chargement de l'image de la super brique
        const imgSuperBrick = new Image();
        imgSuperBrick.src = superBrickImgSrc;
        this.images.superBrick = imgSuperBrick;

        // Chargement de l'image du bonus (on utilise l'image de la super brique pour l'instant)
        const imgBonus = new Image();
        imgBonus.src = superBrickImgSrc;
        this.images.bonus = imgBonus;
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
        this.state.bonuses = [];

        const levelData = this.levels.data[levelIndex];
        if (!levelData) {
            const elH1 = document.querySelector('h1');
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

                let brik;
                //? Si la brique est incassable
                if (brickType === -1) {
                    brik = new Brik(this.images.incassableBrick, 50, 25, brickType);
                }

                //? Sinon si la brique est une super brique
                else if(brickType === 'S'){
                    brik = new Brik(this.images.superBrick, 50, 25, brickType);
                }

                //? Sinon c'est une brique normale
                else {
                    brik = new Brik(this.images.brick, 50, 25, brickType);
                }
                
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
                    // La balle rebondit dans tous les cas
                    if (collisionType === CollisionType.HORIZONTAL) theBall.reverseOrientationX();
                    else theBall.reverseOrientationY();

                    //! MAIS on ne diminue pas la force et n'ajoute un score QUE si la brique n'est PAS incassable
                    if (theBrick.type !== -1) {
                        theBrick.strength--;
                        //? Si la brique est cassable ET pas une super brique => ajouté des points
                        if (theBrick.strength === 0 && theBrick.type !== 'S') {
                            this.updateScore(theBrick.type);
                        }
                        
                        //? Si la brique est une super brique et qu'elle est cassée => faire descendre un bonus
                        if(theBrick.type === 'S' && theBrick.strength === 0){
                            console.log("SUPER BRIQUE CASSÉE");
                            const bonusTypes = Object.values(BonusType);
                            const randomType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
                            
                            // On suppose que le sprite sheet a 4 frames pour l'instant
                            const bonus = new Bonus(this.images.bonus, theBrick.position.x, theBrick.position.y, randomType, 4);
                            this.state.bonuses.push(bonus);
                        }
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

        // Collisions Bonus / Paddle
        this.state.bonuses.forEach(bonus => {
            if (bonus.getCollisionType(this.state.paddle) !== CollisionType.NONE) {
                this.activateBonus(bonus);
                bonus.toRemove = true;
            } else if (bonus.getCollisionType(this.state.deathEdge) !== CollisionType.NONE) {
                bonus.toRemove = true;
            }
        });
    }

    activateBonus(bonus) {
        console.log("Bonus activé : " + bonus.type);
        switch (bonus.type) {
            case BonusType.PADDLE_WIDER:
                this.state.paddle.size.width += 20;
                break;
            case BonusType.PADDLE_NARROWER:
                this.state.paddle.size.width = Math.max(20, this.state.paddle.size.width - 20);
                break;
            case BonusType.BALL_FAST:
                this.state.balls.forEach(ball => ball.speed += 2);
                break;
            case BonusType.BALL_SLOW:
                this.state.balls.forEach(ball => ball.speed = Math.max(2, ball.speed - 2));
                break;
        }
    }

    updateObjects() {
        this.state.balls.forEach(theBall => theBall.update());
        this.state.bonuses.forEach(bonus => bonus.update());
        this.state.bonuses = this.state.bonuses.filter(bonus => !bonus.toRemove);
        
        // On ne retire du state que les briques CASSABLES qui sont détruites
        this.state.bricks = this.state.bricks.filter(theBrick => theBrick.strength !== 0 || theBrick.type === -1);

        // On vérifie s'il reste des briques CASSABLES
        const incassableBricks = this.state.bricks.filter(brick => brick.type !== -1);
        if (incassableBricks.length === 0) {
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
        this.state.bonuses.forEach(bonus => bonus.draw());
    }

    loop() {
        this.checkUserInput();
        this.checkCollisions();
        this.updateObjects();
        this.renderObjects();

        if (this.state.balls.length <= 0 && this.state.bricks.filter(b => b.type !== -1).length > 0) {
            console.log("Kaboooooooom !!!");
            return;
        }
        
        if(this.levels.data[this.currentLevelIndex] || this.state.bricks.filter(b => b.type !== -1).length > 0) {
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