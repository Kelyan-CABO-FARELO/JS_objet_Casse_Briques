import MovingObject from "./MovingObject";
import theGame from "./Game";

export const BonusType = {
    MULTIBALL: 'MULTIBALL',
    //UPPADDLE: 'UPPADDLE',
    //DOWNPADDLE: 'DOWNPADDLE',
    //PERFORBALL: 'PERFORBALL',
    //STICKYBALL: 'STICKYBALL',
    //LASER: 'LASER'
};

export default class Bonus extends MovingObject {
    type;

    constructor(image, x, y, type, numberOfFrames = 1) {
        // Image, width, height, orientation (270 = down), speed
        super(image, 30, 30, 270, 4);
        this.setPosition(x, y);
        this.type = type;
        this.numberOfFrames = numberOfFrames;
    }

    draw() {
        // CORRECTION: Utilisation de la bonne signature de drawImage
        // On dessine l'image entière à la position du bonus
        theGame.ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}