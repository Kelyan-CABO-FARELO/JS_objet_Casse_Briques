// Import de la feuille de style
import '../assets/css/style.css';
// Import des données de configuration
import customConfig from '../config.json';
import levelsConfig from '../levels.json';
// Import des assets pour le thème retro gaming
import ballImgSrcRetroGaming from '../assets/img/retroGaming/ball.png';
import paddleImgSrcRetroGaming from '../assets/img/retroGaming/paddle.png';
import brickImgSrcRetroGaming from '../assets/img/retroGaming/brick.png';
import edgeImgSrcRetroGaming from '../assets/img/retroGaming/edge.png';
import incassableBrickImgSrcRetroGaming from '../assets/img/retroGaming/brick-1.png';
import superBrickImgSrcRetroGaming from '../assets/img/retroGaming/brickS.png';
//Import des assets pour le thème christmas
import ballImgSrcChristmas from '../assets/img/christmas/ball.png';
import paddleImgSrcChristmas from '../assets/img/christmas/paddle.png';
import brickImgSrcChristmas from '../assets/img/christmas/brick.png';
import edgeImgSrcChristmas from '../assets/img/christmas/edge.png';
import incassableBrickImgSrcChristmas from '../assets/img/christmas/brick-1.png';
import superBrickImgSrcChristmas from '../assets/img/christmas/brickS.png';
// Import des assets pour les pouvoirs
import powerMBImgSrc from '../assets/img/power_MB.png';
import powerUPImgSrc from '../assets/img/power_UP.png';
import powerDPImgSrc from '../assets/img/power_DP.png';
import powerBPImgSrc from '../assets/img/power_BP.png';
import powerSBImgSrc from '../assets/img/power_SB.png';
import powerLImgSrc from '../assets/img/power_L.png';
import laserImgSrc from '../assets/img/laser.png';
import x2ImgSrc from '../assets/img/power_X2.png';

// Import des classes
import Ball from "./Ball";
import GameObject from "./GameObject";
import CollisionType from "./DataType/CollisionType";
import Paddle from "./Paddle";
import Brik from "./Brik";
import Edge from "./Edge";
import Bonus, {BonusType} from "./Bonus";
import Laser from "./Laser";

const GameState = {
    MENU: 'MENU',
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    EDITOR: 'EDITOR',
    GAME_OVER: 'GAME_OVER',
    VICTORY: 'VICTORY'
};

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
    x2 = false;
    spanScore;
    currentLevelIndex = 0;
    ctx;
    bonusTimers = {
        upPaddle: null,
        downPaddle: null,
        ballPerfor: null,
        x2 : null
    };
    perforBall = false;
    stickyBall = false;
    laserMunitions = 0;
    life = 3;
    spanLife;
    spanPlayer;
    activeModal = null;
    onePlayer = false;
    twoPlayer = false;
    currentPlayerId = 1;
    players = {
        1: { score: 0, life: 3, levelIndex: 0, bricks: null },
        2: { score: 0, life: 3, levelIndex: 0, bricks: null }
    };
    gameState = GameState.MENU;
    countdownText = null;
    theme = "retroGaming"; // Thème par défaut
    difficulty = "Normal"

    editorGrid = [];

    // MODIFIÉ: Les objets Image sont créés une seule fois ici
    images = {
        ball: new Image(),
        paddle: new Image(),
        brick: new Image(),
        edge: new Image(),
        incassableBrick: new Image(),
        superBrick: new Image(),
        laser: new Image(),
        x2: new Image(),
        bonuses: {
            [BonusType.MULTIBALL]: new Image(),
            [BonusType.UPPADDLE]: new Image(),
            [BonusType.DOWNPADDLE]: new Image(),
            [BonusType.PERFORBALL]: new Image(),
            [BonusType.STICKYBALL]: new Image(),
            [BonusType.LASER]: new Image(),
            [BonusType.X2]: new Image()
        }
    };
    state = {
        balls: [],
        bricks: [],
        bonus: [],
        lasers: [],
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
        this.initHtmlUI();
        this.initImages(); // Charge les images du thème par défaut
        this.initGameObjects();
        this.createStartModal();
        requestAnimationFrame(this.loop.bind(this));
    }

    // -------------------------------------------------------------------------
    // GESTION DES MODALES (START / END / SETTINGS)
    // -------------------------------------------------------------------------

    removeActiveModal() {
        if (this.activeModal && this.activeModal.parentNode) {
            document.body.removeChild(this.activeModal);
            this.activeModal = null;
        }
    }

    createStartModal() {
        this.removeActiveModal();

        const startModal = document.createElement('div');
        startModal.id = 'start-modal';

        const modalContent = document.createElement('div');
        modalContent.id = 'div-modal-content';

        const title = document.createElement('h1');
        title.textContent = 'CASSE BRIQUE';

        const levelSelector = document.createElement('select');
        levelSelector.id = 'selectorLevel';
        this.levels.data.forEach((level, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Niveau ${index + 1}`;
            levelSelector.appendChild(option);
        });

        const startButton = document.createElement('button');
        startButton.id = 'button1Player';
        startButton.textContent = '1 Joueur';
        startButton.addEventListener('click', () => {
            this.onePlayer = true;
            this.twoPlayer = false;
            this.startGame(parseInt(levelSelector.value, 10));
        });

        const button2Players = document.createElement('button');
        button2Players.id = 'button2Players';
        button2Players.textContent = '2 Joueurs';
        button2Players.addEventListener('click', () => {
            this.twoPlayer = true;
            this.onePlayer = false;
            this.startGame(parseInt(levelSelector.value, 10));
        });

        const editorButton = document.createElement('button');
        editorButton.id = 'editorButton';
        editorButton.textContent = 'Éditeur de niveaux';
        editorButton.addEventListener('click', () => {
            this.startEditor();
        });

        const loadCustomBtn = document.createElement('button');
        loadCustomBtn.textContent = 'Jouer niveau Perso';
        loadCustomBtn.id = 'buttonEditLevel';
        loadCustomBtn.onclick = () => {
            const saved = localStorage.getItem('customLevel');
            if (saved) {
                this.levels.data.push(JSON.parse(saved));
                this.onePlayer = true;
                this.twoPlayer = false;
                this.startGame(this.levels.data.length - 1);
            } else {
                alert("Aucun niveau sauvegardé !");
            }
        };

        const setting = document.createElement('button');
        setting.textContent = '⚙️';
        setting.id = 'buttonSetting';
        setting.onclick = () => {
            this.settingModal();
        }

        modalContent.append(title, levelSelector, startButton, button2Players, editorButton, loadCustomBtn, setting);
        startModal.appendChild(modalContent);
        document.body.appendChild(startModal);
        this.activeModal = startModal;
    }

    createEndModal(message) {
        this.removeActiveModal();

        const endModal = document.createElement('div');
        endModal.id = 'start-modal';

        const modalContent = document.createElement('div');
        modalContent.id = 'div-modal-content';

        const title = document.createElement('h1');
        title.textContent = message;

        const scoreDisplay = document.createElement('p');
        scoreDisplay.style.fontSize = '1.2rem';
        scoreDisplay.style.margin = '20px';

        const winner = document.createElement('span');

        if (this.twoPlayer) {
            if(this.players["1"].score > this.players["2"].score){
                winner.innerHTML = "Joueur 1 à gagné !!";
            }else if(this.players["2"].score > this.players["1"].score){
                winner.innerHTML = "Joueur 2 à gagné !!";
            }
            scoreDisplay.innerHTML = `P1: ${this.players[1].score} pts <br> P2: ${this.players[2].score} pts`;
        } else {
            scoreDisplay.textContent = `Score Final : ${this.score}`;
        }

        const restartButton = document.createElement('button');
        restartButton.id = 'buttonStart';
        restartButton.textContent = 'MENU PRINCIPAL';
        restartButton.addEventListener('click', () => {
            window.location.reload();
        });

        modalContent.append(title, winner, scoreDisplay, restartButton);
        endModal.appendChild(modalContent);
        document.body.appendChild(endModal);
        this.activeModal = endModal;
    }

    settingModal(){
        this.removeActiveModal();

        const settingModalElement = document.createElement('div');
        settingModalElement.id = 'start-modal';

        const modalContent = document.createElement('div');
        modalContent.id = 'div-modal-content';

        const themeSelected = document.createElement('span');
        themeSelected.innerHTML = `Thème actuel: ${this.theme}`;
        themeSelected.style.color = 'white';
        themeSelected.style.marginBottom = '20px';
        themeSelected.style.display = 'block';


        const buttonRetroGaming = document.createElement('button');
        buttonRetroGaming.id = 'buttonRetroGaming';
        buttonRetroGaming.textContent = "👾 Rétro Gaming";
        buttonRetroGaming.onclick = () => {
            this.theme = "retroGaming";
            this.initImages();
            this.settingModal();
        }


        const buttonChristmas = document.createElement('button');
        buttonChristmas.id = 'buttonChristmas';
        buttonChristmas.textContent = "🎅 Noël";
        buttonChristmas.onclick = () => {
            this.theme = "christmas";
            this.initImages();
            this.settingModal();
        }

        const difficultySelected = document.createElement('span');
        difficultySelected.innerHTML = `Difficulté actuel : ${this.difficulty}`;
        difficultySelected.style.color = 'white';
        difficultySelected.style.marginBottom = '20px';
        difficultySelected.style.display = 'block';

        const buttonEasy = document.createElement('button');
        buttonEasy.id = 'buttonEasy';
        buttonEasy.textContent = " Facile";
        buttonEasy.onclick = () => {
            this.difficulty = "Facile";
            this.config.ball.speed = 5;
            this.settingModal();
        }

        const buttonBasic = document.createElement('button');
        buttonBasic.id = 'buttonBasic';
        buttonBasic.textContent = " Normale";
        buttonBasic.onclick = () => {
            this.difficulty = "Normal";
            this.config.ball.speed = 8;
            this.settingModal();
        }

        const buttonHard = document.createElement('button');
        buttonHard.id = 'buttonHard';
        buttonHard.textContent = " Difficile";
        buttonHard.onclick = () => {
            this.difficulty = "Difficile";
            this.config.ball.speed = 10;
            this.settingModal();
        }

        const buttonExit = document.createElement('button');
        buttonExit.id = 'buttonExit';
        buttonExit.textContent = " Retour";
        buttonExit.onclick = () => {
            this.createStartModal();
        }


        modalContent.append(themeSelected, buttonRetroGaming, buttonChristmas, difficultySelected, buttonEasy, buttonBasic, buttonHard, buttonExit);
        settingModalElement.appendChild(modalContent);
        document.body.appendChild(settingModalElement);
        this.activeModal = settingModalElement;
    }

    // -------------------------------------------------------------------------
    // GESTION DE L'ÉDITEUR
    // -------------------------------------------------------------------------

    startEditor() {
        this.gameState = GameState.EDITOR;
        this.removeActiveModal();

        const editorUI = document.createElement('div');
        editorUI.id = 'editor-ui';
        editorUI.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.8);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            z-index: 100;
        `;

        const palette = document.createElement('div');
        palette.style.cssText = `
            background-color: #333; padding: 10px; border-radius: 5px;
            display: flex; gap: 5px; margin-bottom: 20px;
        `;

        const createPaletteButton = (type, text, imageSrc) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                width: 50px; height: 25px; background-color: #555; border: 1px solid #FFF;
                cursor: pointer; font-size: 0.8rem; color: white;
                background-image: url(${imageSrc}); background-size: cover;
                background-position: center;
            `;
            btn.onclick = () => {
                this.selectedBrickType = type;
                Array.from(palette.children).forEach(child => {
                    child.style.border = '1px solid #FFF';
                });
                btn.style.border = '2px solid #00FFFF';
            };
            return btn;
        };

        palette.append(
            createPaletteButton(1, '1', this.images.brick.src),
            createPaletteButton(2, '2', this.images.brick.src),
            createPaletteButton(3, '3', this.images.brick.src),
            createPaletteButton(4, '4', this.images.brick.src),
            createPaletteButton('S', 'S', this.images.superBrick.src),
            createPaletteButton(-1, 'X', this.images.incassableBrick.src),
            createPaletteButton(0, 'Effacer', '')
        );

        const saveBtn = document.createElement('button');
        saveBtn.textContent = "SAUVEGARDER ET JOUER";
        saveBtn.id = "buttonSave";
        saveBtn.style.cssText = `
            font-family: 'Press Start 2P', cursive; padding: 10px; cursor: pointer;
            background-color: #00FF00; color: black; border: 2px solid #00FF00;
            margin-top: 20px;
        `;
        saveBtn.onclick = () => this.saveCustomLevel();

        editorUI.append(palette, saveBtn);
        document.body.appendChild(editorUI);
        this.activeModal = editorUI;

        const rows = 19;
        const cols = 16;
        this.editorGrid = Array(rows).fill(0).map(() => Array(cols).fill(0));
    }

    handleMouseInput(e) {
        if (this.gameState !== GameState.EDITOR || !this.selectedBrickType) return;

        const rect = this.ctx.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const brickWidth = 50;
        const brickHeight = 25;
        const offsetX = 20;
        const offsetY = 20;

        const col = Math.floor((x - offsetX) / brickWidth);
        const row = Math.floor((y - offsetY) / brickHeight);

        if (row >= 0 && row < this.editorGrid.length && col >= 0 && col < this.editorGrid[0].length) {
            this.editorGrid[row][col] = this.selectedBrickType;
        }
    }

    saveCustomLevel() {
        localStorage.setItem('customLevel', JSON.stringify(this.editorGrid));
        this.removeActiveModal();
        
        const customData = JSON.parse(localStorage.getItem('customLevel'));
        this.levels.data.push(customData);

        this.onePlayer = true;
        this.twoPlayer = false;
        this.startGame(this.levels.data.length - 1);
    }

    renderEditor() {
        this.ctx.clearRect(0, 0, this.config.canvasSize.width, this.config.canvasSize.height);

        this.state.bouncingEdges.forEach(edge => edge.draw());

        const brickWidth = 50;
        const brickHeight = 25;
        const offsetX = 20;
        const offsetY = 20;

        for (let r = 0; r < this.editorGrid.length; r++) {
            for (let c = 0; c < this.editorGrid[r].length; c++) {
                const x = offsetX + (c * brickWidth);
                const y = offsetY + (r * brickHeight);

                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.strokeRect(x, y, brickWidth, brickHeight);

                const type = this.editorGrid[r][c];
                if (type === 0) continue;

                let imageToDraw;
                if (type === 'S') {
                    imageToDraw = this.images.superBrick;
                } else if (type === -1) {
                    imageToDraw = this.images.incassableBrick;
                } else {
                    imageToDraw = this.images.brick;
                }
                
                if (type > 0 && type < 5) {
                    const sourceX = (brickWidth * type) - brickWidth;
                    const sourceY = 0;
                    this.ctx.drawImage(
                        imageToDraw,
                        sourceX, sourceY, brickWidth, brickHeight,
                        x, y, brickWidth, brickHeight
                    );
                } else {
                    this.ctx.drawImage(imageToDraw, x, y, brickWidth, brickHeight);
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // LOGIQUE DE JEU
    // -------------------------------------------------------------------------

    startGame(levelIndex) {
        this.removeActiveModal();

        this.currentLevelIndex = levelIndex;
        this.currentPlayerId = 1;

        this.players[1] = { score: 0, life: 3, levelIndex: levelIndex, bricks: null };
        this.players[2] = { score: 0, life: 3, levelIndex: levelIndex, bricks: null };

        this.score = 0;
        this.life = 3;
        this.updateScore(0);
        this.updateLifeDisplay();
        this.updatePlayerDisplay();

        this.loadLevel(this.currentLevelIndex, false);
        this.startCountdown();
    }

    startCountdown() {
        this.gameState = GameState.COUNTDOWN;
        this.countdownText = '3';
        setTimeout(() => {
            this.countdownText = '2';
            setTimeout(() => {
                this.countdownText = '1';
                setTimeout(() => {
                    this.countdownText = 'GO!';
                    this.gameState = GameState.PLAYING;
                    this.state.balls.forEach(ball => {
                        if (ball.isStuck) {
                            ball.speed = this.config.ball.speed;
                            ball.isStuck = false;
                        }
                    });
                    setTimeout(() => {
                        this.countdownText = null;
                    }, 500);
                }, 1000);
            }, 1000);
        }, 1000);
    }

    initHtmlUI() {
        const elH1 = document.createElement('h1');
        elH1.textContent = 'Casse Brique !️';

        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-around';
        infoContainer.style.width = '100%';
        infoContainer.style.maxWidth = '800px';

        const scoreContainer = document.createElement('div');
        scoreContainer.textContent = 'Score: ';
        this.spanScore = document.createElement('span');
        this.spanScore.textContent = this.score;
        scoreContainer.appendChild(this.spanScore);

        const elLife = document.createElement('div');
        elLife.textContent = 'Vie restante: ';
        this.spanLife = document.createElement('span');
        this.spanLife.textContent = this.life;
        elLife.appendChild(this.spanLife);

        const elPlayer = document.createElement('div');
        elPlayer.textContent = 'Joueur: ';
        this.spanPlayer = document.createElement('span');
        this.spanPlayer.textContent = '1';
        elPlayer.appendChild(this.spanPlayer);

        infoContainer.append(elPlayer, scoreContainer, elLife);

        const elCanvas = document.createElement('canvas');
        elCanvas.width = this.config.canvasSize.width;
        elCanvas.height = this.config.canvasSize.height;

        document.body.append(elH1, infoContainer, elCanvas);
        this.ctx = elCanvas.getContext('2d');

        elCanvas.addEventListener('mousedown', this.handleMouseInput.bind(this));

        document.addEventListener('keydown', this.handlerKeyboard.bind(this, true));
        document.addEventListener('keyup', this.handlerKeyboard.bind(this, false));
    }

    updateScore(points) {
        if(this.x2 === true){
            const multiplicateur = 2;
            this.score += (points * 100) * multiplicateur;
            this.spanScore.textContent = this.score;
            return;
        }
        this.score += points * 100;
        this.spanScore.textContent = this.score;
    }

    updateLifeDisplay() {
        this.spanLife.textContent = this.life;
    }

    updatePlayerDisplay() {
        if (this.twoPlayer) {
            this.spanPlayer.textContent = this.currentPlayerId;
        } else {
            this.spanPlayer.textContent = '1';
        }
    }

    loseLife() {
        this.life--;
        this.updateLifeDisplay();

        if (this.twoPlayer) {
            const otherPlayerId = this.currentPlayerId === 1 ? 2 : 1;
            if (this.players[otherPlayerId].life > 0) {
                this.switchTurn();
                return;
            }
        }

        if (this.life <= 0) {
            this.gameState = GameState.GAME_OVER;
            this.players[this.currentPlayerId].score = this.score;

            let msg = this.twoPlayer
                ? `GAME OVER`
                : "GAME OVER";
            this.createEndModal(msg);
            return;
        }

        this.resetBall(true);
    }

    switchTurn() {
        this.players[this.currentPlayerId].score = this.score;
        this.players[this.currentPlayerId].life = this.life;
        this.players[this.currentPlayerId].levelIndex = this.currentLevelIndex;
        this.players[this.currentPlayerId].bricks = this.state.bricks;

        this.currentPlayerId = this.currentPlayerId === 1 ? 2 : 1;

        this.score = this.players[this.currentPlayerId].score;
        this.life = this.players[this.currentPlayerId].life;
        this.currentLevelIndex = this.players[this.currentPlayerId].levelIndex;

        this.updateScore(0);
        this.updateLifeDisplay();
        this.updatePlayerDisplay();

        this.state.bonus = [];
        this.state.lasers = [];
        this.state.balls = [];
        this.perforBall = false;
        this.stickyBall = false;
        this.laserMunitions = 0;

        if (this.players[this.currentPlayerId].bricks) {
            this.state.bricks = this.players[this.currentPlayerId].bricks;
            this.resetBall(true);
        } else {
            this.loadLevel(this.currentLevelIndex, true);
        }

        console.log(`Tour du Joueur ${this.currentPlayerId}`);
    }

    resetBall(withCountdown = false) {
        this.state.balls = [];
        const paddle = this.state.paddle;
        const randomAngle = Math.floor(Math.random() * 120) + 31;
        const ballDiameter = this.config.ball.radius * 2;
        const ball = new Ball(this.images.ball, ballDiameter, ballDiameter, randomAngle, 0);
        ball.isStuck = true;
        const ballX = paddle.position.x + (paddle.size.width / 2) - (ball.size.width / 2);
        const ballY = paddle.position.y - ball.size.height - 5;
        ball.setPosition(ballX, ballY);
        ball.isCircular = true;
        this.state.balls.push(ball);

        if (withCountdown) {
            this.startCountdown();
        }
    }

    // MODIFIÉ: La méthode ne fait que changer les .src des objets Image existants
    initImages() {
        if(this.theme === "retroGaming") {
            this.images.ball.src = ballImgSrcRetroGaming;
            this.images.paddle.src = paddleImgSrcRetroGaming;
            this.images.brick.src = brickImgSrcRetroGaming;
            this.images.edge.src = edgeImgSrcRetroGaming;
            this.images.incassableBrick.src = incassableBrickImgSrcRetroGaming;
            this.images.superBrick.src = superBrickImgSrcRetroGaming;
        } else if(this.theme === "christmas"){
            this.images.ball.src = ballImgSrcChristmas;
            this.images.paddle.src = paddleImgSrcChristmas;
            this.images.brick.src = brickImgSrcChristmas;
            this.images.edge.src = edgeImgSrcChristmas;
            this.images.incassableBrick.src = incassableBrickImgSrcChristmas;
            this.images.superBrick.src = superBrickImgSrcChristmas;
        }
        
        // Les images non-thématiques sont chargées une seule fois
        this.images.laser.src = laserImgSrc;
        this.images.x2.src = x2ImgSrc;

        this.images.bonuses[BonusType.MULTIBALL].src = powerMBImgSrc;
        this.images.bonuses[BonusType.UPPADDLE].src = powerUPImgSrc;
        this.images.bonuses[BonusType.DOWNPADDLE].src = powerDPImgSrc;
        this.images.bonuses[BonusType.PERFORBALL].src = powerBPImgSrc;
        this.images.bonuses[BonusType.STICKYBALL].src = powerSBImgSrc;
        this.images.bonuses[BonusType.LASER].src = powerLImgSrc;
        this.images.bonuses[BonusType.X2].src = x2ImgSrc;
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

        this.loadLevel(this.currentLevelIndex, false);
    }

    loadLevel(levelIndex, withCountdown = true) {
        this.state.bricks = [];
        this.state.bonus = [];
        this.state.lasers = [];

        const levelData = this.levels.data[levelIndex];

        if (!levelData) {
            this.gameState = GameState.VICTORY;
            this.players[this.currentPlayerId].score = this.score;
            let msg = this.twoPlayer
                ? "VICTOIRE !"
                : "VICTOIRE !";
            this.createEndModal(msg);
            return;
        }

        this.loadBricks(levelData);
        this.resetBall(withCountdown);
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

        this.state.balls.forEach(ball => {
            if (ball.isStuck) {
                ball.position.x = paddle.position.x + (paddle.size.width / 2) - (ball.size.width / 2);
                ball.position.y = paddle.position.y - ball.size.height - 5;
            }
        });
    }

    checkCollisions() {
        this.state.balls = this.state.balls.filter(theBall => theBall.getCollisionType(this.state.deathEdge) === CollisionType.NONE);

        this.state.balls.forEach(theBall => {
            this.state.bouncingEdges.forEach(theEdge => {
                const collisionType = theBall.getCollisionType(theEdge);
                if (collisionType === CollisionType.HORIZONTAL) theBall.reverseOrientationX();
                else if (collisionType === CollisionType.VERTICAL) theBall.reverseOrientationY();
            });

            this.state.bricks.forEach(theBrick => {
                if (theBrick.strength <= 0 && theBrick.type !== -1) return;

                const collisionType = theBall.getCollisionType(theBrick);

                if (collisionType !== CollisionType.NONE) {
                    if (!this.perforBall || theBrick.type === -1) {
                        if (collisionType === CollisionType.HORIZONTAL) theBall.reverseOrientationX();
                        else theBall.reverseOrientationY();
                    }

                    if (theBrick.type !== -1) {
                        theBrick.strength--;
                        if (theBrick.strength === 0 && theBrick.type !== 'S') this.updateScore(theBrick.type);

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
                if (this.stickyBall) {
                    theBall.speed = 0;
                    theBall.isStuck = true;
                } else {
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

        this.state.bonus.forEach(bonus => {
            if (bonus.getCollisionType(this.state.paddle) !== CollisionType.NONE) {
                this.activateBonus(bonus);
                bonus.toRemove = true;
            } else if (bonus.getCollisionType(this.state.deathEdge) !== CollisionType.NONE) {
                bonus.toRemove = true;
            }
        });

        this.state.lasers.forEach(laser => {
            this.state.bricks.forEach(brick => {
                if (brick.strength <= 0) return;

                if (laser.getCollisionType(brick) !== CollisionType.NONE) {
                    laser.toRemove = true;
                    if (brick.type !== -1) {
                        brick.strength--;
                        if (brick.strength === 0 && brick.type !== 'S') this.updateScore(brick.type);
                    }
                }
            });

            if (laser.position.y < 0) {
                laser.toRemove = true;
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
                this.laserMunitions += 3;
                break;
            case BonusType.X2:
                if(this.bonusTimers.x2) clearTimeout(this.bonusTimers.x2);
                this.x2 = true;
                this.bonusTimers.x2 = setTimeout(() => {
                    this.x2 = false;
                    this.bonusTimers.x2 = null;
                }, 10000);
                break;
        }
    }

    updateObjects() {
        this.state.balls.forEach(theBall => {
            if (!theBall.isStuck) {
                theBall.update();
            }
        });
        this.state.bonus.forEach(bonus => bonus.update());
        this.state.lasers.forEach(laser => laser.update());

        this.state.bonus = this.state.bonus.filter(bonus => !bonus.toRemove);
        this.state.lasers = this.state.lasers.filter(laser => !laser.toRemove);

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
        this.state.lasers.forEach(laser => laser.draw());

        if (this.countdownText) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 80px 'Press Start 2P'";
            this.ctx.textAlign = "center";
            this.ctx.fillText(this.countdownText, this.config.canvasSize.width / 2, this.config.canvasSize.height / 2);
        }
    }

    loop() {
        switch (this.gameState) {
            case GameState.MENU:
                this.renderObjects();
                break;
            case GameState.EDITOR:
                this.renderEditor();
                break;
            case GameState.COUNTDOWN:
                this.checkUserInput();
                this.renderObjects();
                break;
            case GameState.PLAYING:
                this.checkUserInput();
                this.checkCollisions();
                this.updateObjects();
                this.renderObjects();
                if (this.state.balls.length <= 0) {
                    this.loseLife();
                }
                break;
            case GameState.GAME_OVER:
            case GameState.VICTORY:
                return;
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    handlerKeyboard(isActive, evt) {
        if (evt.key === 'Right' || evt.key === 'ArrowRight') {
            if (isActive && this.state.userInput.paddleLeft) this.state.userInput.paddleLeft = false;
            this.state.userInput.paddleRight = isActive;
        } else if (evt.key === 'Left' || evt.key === 'ArrowLeft') {
            if (isActive && this.state.userInput.paddleRight) this.state.userInput.paddleRight = false;
            this.state.userInput.paddleLeft = isActive;
        }

        if(isActive && (evt.key === ' ' || evt.key === 'Spacebar')){
            if (this.gameState !== GameState.PLAYING) return;

            let ballWasStuck = false;
            this.state.balls.forEach(ball => {
                if (ball.isStuck) {
                    ball.speed = this.config.ball.speed;
                    ball.isStuck = false;
                    ballWasStuck = true;
                }
            });
            if (ballWasStuck) this.stickyBall = false;

            else if (this.laserMunitions > 0) {
                const paddle = this.state.paddle;
                const laserLeft = new Laser(this.images.laser, paddle.position.x + 10, paddle.position.y);
                const laserRight = new Laser(this.images.laser, paddle.position.x + paddle.size.width - 20, paddle.position.y);

                this.state.lasers.push(laserLeft, laserRight);
                this.laserMunitions--;
            }
        }
    }
}

const theGame = new Game(customConfig, levelsConfig);
export default theGame;