import MovingObject from "./MovingObject";

export default class Paddle extends MovingObject
{
    equipment;
    xRange;

    update(){
        super.update();

        // On récupère les limites du paddle
        let bounds = this.getBounds();
        //? Si la position dépasse le range du paddle, on la limite, on la limite
        if(bounds.left < this.xRange.min) {
            this.position.x = this.xRange.min;
        }else if(bounds.right > this.xRange.max){
            this.position.x = this.xRange.max;
        }
    }
}