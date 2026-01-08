import Vector from "./DataType/Vector";
import GameObject from "./GameObject";
import CustomMath from "./CustomMath";

export default class MovingObject extends GameObject {
    speed = 1;
    orientation = 45;
    velocity;

    constructor(image, width, height, orientation, speed) {
        super(image, width, height);
        this.orientation = orientation;
        this.speed = speed;

        this.velocity = new Vector();
    }

    // Méthode pour inverser les coordonnées x lors d'une collision
    reverseOrientationX(){
        this.orientation = 180 - this.orientation;
    }

    // Méthode pour inverser les coordonnées y lors d'une collision
    reverseOrientationY(){
        this.orientation *= -1;
    }

    //Méthode de mise à jour des coordonnées
    update() {
        let radOrientation = CustomMath.degToRad(this.orientation)
        this.velocity.x = this.speed * Math.cos(radOrientation);
        this.velocity.y = this.speed * Math.sin(radOrientation) * -1;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y
    }
}