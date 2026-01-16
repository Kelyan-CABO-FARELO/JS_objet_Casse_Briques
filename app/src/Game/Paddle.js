import MovingObject from "./MovingObject";
import theGame from "./Game";

export default class Paddle extends MovingObject
{
    // --- Configuration ---
    animationIndex = 0;
    frameTick = 0;
    animSpeed = 13;
    frameCount = 5;
    // ---------------------

    update() {
        super.update();

        this.frameTick++;
        if (this.frameTick >= this.animSpeed) {
            this.frameTick = 0;
            this.animationIndex++;
            if (this.animationIndex >= this.frameCount) {
                this.animationIndex = 0;
            }
        }
    }

    draw() {
        if (!this.image.width) return;

        // 1. Définir la source (la partie de l'image à découper)
        const frameWidth = Math.floor(this.image.width / this.frameCount);
        const frameHeight = this.image.height;
        const sourceX = this.animationIndex * frameWidth;

        // 2. Définir la destination
        
        // La largeur de destination est la largeur actuelle de la hitbox
        const destWidth = this.size.width;
        
        // La hauteur de destination est la hauteur de l'image pour ne pas la déformer
        const destHeight = frameHeight;

        // La position X de destination est la position de la hitbox
        const destX = this.position.x;
        
        // On centre verticalement l'image par rapport à la hitbox
        const destY = this.position.y - (destHeight - this.size.height) / 2;

        // 3. Dessiner l'image
        theGame.ctx.drawImage(
            this.image,
            sourceX,
            0,
            frameWidth,
            frameHeight,
            destX,
            destY,
            destWidth,
            destHeight
        );
    }
}