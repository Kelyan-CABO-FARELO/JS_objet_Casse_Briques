import MovingObject from "./MovingObject";
import CollisionType from "./DataType/CollisionType";

export default class Ball extends MovingObject
{
    getCollisionType(foreignGameObject){
        const bounds = this.getBounds();
        const foreignBounds = foreignGameObject.getBounds();

        // Collision horizontale (Bords droit et gauche)
        if(
            (
                bounds.right >= foreignBounds.left
                && bounds.right <= foreignBounds.right
                ||
                bounds.left <= foreignBounds.right
                && bounds.left >= foreignBounds.left
            )
            && bounds.top >= foreignBounds.top
            && bounds.bottom <= foreignBounds.bottom
        ){
            return CollisionType.HORIZONTAL
        }

        // Collision verticale (Bords haut et bas
        else if(
            (
                bounds.top <= foreignBounds.bottom
                && bounds.top >= foreignBounds.top
                ||
                bounds.bottom >= foreignBounds.top
                && bounds.bottom <= foreignBounds.bottom
            )
            && bounds.left >= foreignBounds.left
            && bounds.right <= foreignBounds.right
        ){
            return CollisionType.VERTICAL
        }

        // Aucune Collision
        return CollisionType.NONE
    }
}