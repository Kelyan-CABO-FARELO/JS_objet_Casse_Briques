import GameObject from "./GameObject";

export default class Brik extends GameObject
{
    strength;

    constructor(image, width, height, strength = 1){
        super(image, width, height);
        this.strength = strength;
    }
}