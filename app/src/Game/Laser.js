import MovingObject from "./MovingObject";
import theGame from "./Game";

// La classe Laser est très simple. C'est un objet qui monte.
export default class Laser extends MovingObject {
    
    constructor(image, x, y) {
        // Image, width, height, orientation (90 = up), speed
        super(image, 10, 30, 90, 12);
        this.setPosition(x, y);
    }

    draw() {
        theGame.ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}