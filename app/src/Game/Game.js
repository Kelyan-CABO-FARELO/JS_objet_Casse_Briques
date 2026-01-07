// Import de la feuille de style
import '../assets/css/style.css';

class Game
{
    //Contexte de dessin du canvas
    ctx;

    start(){
        console.log('Jeu démarré ...');
        this.initHtmlUI();
        //this.drawTest()
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