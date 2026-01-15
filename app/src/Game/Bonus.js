import MovingObject from "./MovingObject";
import theGame from "./Game";

export const BonusType = {
    PADDLE_WIDER: 'PADDLE_WIDER',
    PADDLE_NARROWER: 'PADDLE_NARROWER',
    BALL_FAST: 'BALL_FAST',
    BALL_SLOW: 'BALL_SLOW'
};

export default class Bonus extends MovingObject
{
    type;
    
    // Propriétés pour l'animation
    numberOfFrames = 1;
    frameIndex = 0;
    tickCount = 0;
    ticksPerFrame = 10; // Vitesse de l'animation

    constructor(image, x, y, type, numberOfFrames = 1) {
        // Image, width, height, orientation (270 = down), speed
        super(image, 30, 30, 270, 4);
        this.setPosition(x, y);
        this.type = type;
        this.numberOfFrames = numberOfFrames;
    }

    update() {
        super.update();

        // Mise à jour de l'animation
        if (this.numberOfFrames > 1) {
            this.tickCount++;
            if (this.tickCount > this.ticksPerFrame) {
                this.tickCount = 0;
                this.frameIndex++;
                if (this.frameIndex >= this.numberOfFrames) {
                    this.frameIndex = 0;
                }
            }
        }
    }

    draw() {
        if (this.numberOfFrames > 1) {
            // Calcul de la position de la frame dans le sprite sheet (supposé horizontal)
            // On suppose que la largeur d'une frame correspond à la largeur de l'objet (30px)
            const sourceX = this.frameIndex * this.size.width;
            
            theGame.ctx.drawImage(
                this.image,
                sourceX,
                0,
                this.size.width,
                this.size.height,
                this.position.x,
                this.position.y,
                this.size.width,
                this.size.height
            );
        } else {
            // Si pas d'animation, on utilise le draw par défaut
            super.draw();
        }
    }
}