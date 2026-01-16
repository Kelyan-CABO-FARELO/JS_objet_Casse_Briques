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
import powerMBImgSrc from '../assets/img/power_MB.png';
import powerUPImgSrc from '../assets/img/power_UP.png';
import powerDPImgSrc from '../assets/img/power_DP.png';
import powerBPImgSrc from '../assets/img/power_BP.png';
import powerSBImgSrc from '../assets/img/power_SB.png';
import powerLImgSrc from '../assets/img/power_L.png';

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
            width: 150,
            height: 20
        }
    }

    levels;
    score = 0;
    spanScore;
    currentLevelIndex = 0;
    ctx;
    bonusTimers = {
        upPaddle: null,
        downPaddle: null,
        ballPerfor: null
    };
    perforBall = false;
    stickyBall = false;

    images = {
        ball: null, paddle: null, brick: null, edge: null, incassableBrick: null, superBrick: null,
        bonuses: {}
    };
    state = {
        balls: [],
        bricks: [],
        bonus: [],
        deathEdge: null,
        bouncingEdges: [],
        paddle: null,
        userInput: {
            paddleLeft: false,
            paddleRight: false,
            bonusSpace: false
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
        this.images.ball = new Image(); this.images.ball.src = ballImgSrc;
        this.images.paddle = new Image(); this.images.paddle.src = paddleImgSrc;
        this.images.brick = new Image(); this.images.brick.src = brickImgSrc;
        this.images.edge = new Image(); this.images.edge.src = edgeImgSrc;
        this.images.incassableBrick = new Image(); this.images.incassableBrick.src = incassableBrickImgSrc;
        this.images.superBrick = new Image(); this.images.superBrick.src = superBrickImgSrc;

        this.images.bonuses[BonusType.MULTIBALL] = new Image(); this.images.bonuses[BonusType.MULTIBALL].src = powerMBImgSrc;
        this.images.bonuses[BonusType.UPPADDLE] = new Image(); this.images.bonuses[BonusType.UPPADDLE].src = powerUPImgSrc;
        this.images.bonuses[BonusType.DOWNPADDLE] = new Image(); this.images.bonuses[BonusType.DOWNPADDLE].src = powerDPImgSrc;
        this.images.bonuses[BonusType.PERFORBALL] = new Image(); this.images.bonuses[BonusType.PERFORBALL].src = powerBPImgSrc;
        this.images.bonuses[BonusType.STICKYBALL] = new Image(); this.images.bonuses[BonusType.STICKYBALL].src = powerSBImgSrc;
        this.images.bonuses[BonusType.LASER] = new Image(); this.images.bonuses[BonusType.LASER].src = powerLImgSrc;
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
        this.state.bonus = [];

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
                if (brickType === -1) {
                    brik = new Brik(this.images.incassableBrick, 50, 25, brickType);
                } else if(brickType === 'S'){
                    brik = new Brik(this.images.superBrick, 50, 25, brickType);
                } else {
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
                if (theBrick.strength <= 0 && theBrick.type !== -1) {
                    return;
                }
                
                const collisionType = theBall.getCollisionType(theBrick);

                if (collisionType !== CollisionType.NONE) {
                    if (!this.perforBall) {
                        if (collisionType === CollisionType.HORIZONTAL) theBall.reverseOrientationX();
                        else theBall.reverseOrientationY();
                    }

                    if (theBrick.type !== -1) {
                        theBrick.strength--;
                        if (theBrick.strength === 0 && theBrick.type !== 'S') {
                            this.updateScore(theBrick.type);
                        }
                        
                        if(theBrick.type === 'S' && theBrick.strength === 0){
                            const bonusTypes = Object.values(BonusType);
                            const randomType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
                            
                            const bonusImage = this.images.bonuses[randomType];
                            const newBonus = new Bonus(bonusImage, 50, 25, randomType);
                            newBonus.setPosition(theBrick.position.x, theBrick.position.y);
                            this.state.bonus.push(newBonus);
                        }
                    }
                }
            });

            const paddleCollisionType = theBall.getCollisionType(this.state.paddle);
            if (paddleCollisionType === CollisionType.VERTICAL) {
                // Si le stickyBall est actif, on colle la balle
                if (this.stickyBall) {
                    theBall.speed = 0;
                    theBall.isStuck = true;
                } else {
                    // Sinon, on la fait rebondir normalement
                    let alteration = 0;
                    if (this.state.userInput.paddleRight) alteration = -1 * this.config.ball.angleAlteration;
                    else if (this.state.userInput.paddleLeft) alteration = this.config.ball.angleAlteration;
                    theBall.reverseOrientationY(alteration);

                    if (theBall.orientation === 0) theBall.orientation = 10;
                    else if (theBall.orientation === 180) theBall.orientation = 170;
                }
            } else if (paddleCollisionType === CollisionType.HORIZONTAL) {
                theBall.reverseOrientationX();
            }
        });
        this.state.balls = savedBalls;

        this.state.bonus.forEach(bonus => {
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
            case BonusType.MULTIBALL:
                if (this.state.balls.length > 0) {
                    const motherBall = this.state.balls[0];
                    const numberOfNewBalls = 5;
                    const angleSpread = 15;

                    for (let i = 0; i < numberOfNewBalls; i++) {
                        const newAngle = motherBall.orientation + (i - Math.floor(numberOfNewBalls / 2)) * angleSpread;
                        const newBall = new Ball(motherBall.image, motherBall.size.width, motherBall.size.height, newAngle, motherBall.speed);
                        newBall.setPosition(motherBall.position.x, motherBall.position.y);
                        newBall.isCircular = true;
                        this.state.balls.push(newBall);
                    }
                }
                break;
            case BonusType.UPPADDLE:
                if (this.bonusTimers.upPaddle) clearTimeout(this.bonusTimers.upPaddle);
                this.state.paddle.size.width = 200;
                this.bonusTimers.upPaddle = setTimeout(() => {
                    this.state.paddle.size.width = this.config.paddleSize.width;
                    this.bonusTimers.upPaddle = null;
                }, 10000);
                break;
            case BonusType.DOWNPADDLE:
                if (this.bonusTimers.downPaddle) clearTimeout(this.bonusTimers.downPaddle);
                this.state.paddle.size.width = 100;
                this.bonusTimers.downPaddle = setTimeout(() => {
                    this.state.paddle.size.width = this.config.paddleSize.width;
                    this.bonusTimers.downPaddle = null;
                }, 10000);
                break;
            case BonusType.PERFORBALL:
                if (this.bonusTimers.ballPerfor) clearTimeout(this.bonusTimers.ballPerfor);
                this.perforBall = true;
                this.bonusTimers.ballPerfor = setTimeout(() => {
                    this.perforBall = false;
                    this.bonusTimers.ballPerfor = null;
                }, 10000);
                break;
            case BonusType.STICKYBALL:
                this.stickyBall = true;
                break;
            case BonusType.LASER:
        }
    }

    updateObjects() {
        this.state.balls.forEach(theBall => {
            // Si la balle est collée, on met à jour sa position pour qu'elle suive le paddle
            if (theBall.isStuck) {
                const paddle = this.state.paddle;
                theBall.position.x = paddle.position.x + (paddle.size.width / 2) - (theBall.size.width / 2);
                theBall.position.y = paddle.position.y - theBall.size.height;
            } else {
                theBall.update();
            }
        });
        this.state.bonus.forEach(bonus => bonus.update());
        this.state.bonus = this.state.bonus.filter(bonus => !bonus.toRemove);
        
        this.state.bricks = this.state.bricks.filter(theBrick => theBrick.strength !== 0 || theBrick.type === -1);

        const breakableBricks = this.state.bricks.filter(brick => brick.type !== -1);
        if (breakableBricks.length === 0) {
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
        this.state.bonus.forEach(bonus => bonus.draw());
    }

    loop() {
        this.checkUserInput();
        this.checkCollisions();
        this.updateObjects();
        this.renderObjects();

        if (this.state.balls.length <= 0 && this.state.bricks.filter(b => b.type !== -1).length > 0) {
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
        
        // Si on appuie sur Espace (et pas quand on relâche)
        if(isActive && (evt.key === ' ' || evt.key === 'Spacebar')){
            // On cherche une balle collée pour la relancer
            this.state.balls.forEach(ball => {
                if (ball.isStuck) {
                    ball.speed = this.config.ball.speed; // On lui redonne sa vitesse
                    ball.isStuck = false; // Elle n'est plus collée
                    this.stickyBall = false; // On désactive le bonus
                }
            });
        }
    }
}

const theGame = new Game(customConfig, levelsConfig);
export default theGame;