// Import de la feuille de style
import './assets/css/style.css';

const elH1 = document.createElement('h1');
elH1.textContent = 'Hello World !';

document.body.append(elH1);

const elCanvas = document.createElement('canvas');
elCanvas.width = 800;
elCanvas.height = 600;

document.body.append(elCanvas);

//Le contexte de dessin
const ctx = elCanvas.getContext('2d');
ctx.fillStyle = '#fc0';
ctx.arc(400, 300, 100, Math.PI/6, -Math.PI/6);
ctx.closePath();
ctx.fill();