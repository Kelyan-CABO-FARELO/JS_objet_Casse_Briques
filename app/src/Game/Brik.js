import GameObject from "./GameObject";
import theGame from "./Game";

export default class Brik extends GameObject
{
    type;
    strength;

    constructor(image, width, height, type = 1){
        super(image, width, height);
        
        this.type = type;

        // Si la brique est une super brique, sa force est de 1
        if (type === 'S') {
            this.strength = 1;
        } 
        // Sinon, la force est égale au type (pour les briques normales et incassables)
        else {
            this.strength = type;
        }
    }

    draw() {
        // Si la brique est spéciale (incassable ou super), on dessine l'image directement
        if (this.type === -1 || this.type === 'S') {
            theGame.ctx.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height
            );
            return; // On arrête ici pour ne pas exécuter le code de découpage
        }

        // Les briques standard
        const sourceX = (this.size.width * this.type) - this.size.width;
        const sourceY = (this.size.height * this.strength) - this.size.height;
        theGame.ctx.drawImage(
            this.image,
            sourceX,
            sourceY,
            this.size.width,
            this.size.height,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}