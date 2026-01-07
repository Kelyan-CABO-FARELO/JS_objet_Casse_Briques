// Import de la feuille de style
import '../assets/css/style.css';
// Import des assets de sprite
import ballImgSrc from'../assets/img/ball.png';

class Game
{
    //Contexte de dessin du canvas
    ctx;

    start(){
        console.log('Jeu démarré ...');
        this.initHtmlUI();
        //this.drawTest()

        //Temporaire : Dessin de la balle à partir d'une image
        // 1- On crée une balise HTML <img> qui ne sera jamais ajouté au DOM
        const ballImg = new Image();
        // 2- On récupère le nom de l'image généré par webpack en tant que src de cette image
        ballImg.src = ballImgSrc;
        // 3- On demande au contexte de dessin de dessiner cette image dans le canvas
        ballImg.addEventListener('load', () => {this.ctx.drawImage(ballImg, 400, 300, 40, 40);});


    }

    //Méthode "privées"
    initHtmlUI(){

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

    // Fonction de test inutile dans le jeu
    drawTest(){
        this.ctx.fillStyle = '#fc0';
        this.ctx.arc(400, 300, 100, Math.PI/6, -Math.PI/6);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

const theGame = new Game();

export default theGame;