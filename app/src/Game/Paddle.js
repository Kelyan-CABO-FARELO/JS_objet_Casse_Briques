import MovingObject from "./MovingObject";
import theGame from "./Game";

export default class Paddle extends MovingObject
{
    // --- Configuration ---
    animationIndex = 0;
    frameTick = 0;

    // VITESSE :
    // 10 = Rapide | 20 = Moyen | 45 = Lent
    // Essayez 15 pour commencer.
    animSpeed = 13;

    // Nombre d'étapes dans l'image (votre nouvelle image en a 5)
    frameCount = 5;
    // ---------------------

    update() {
        super.update();

        // Compteur de temps
        this.frameTick++;
        if (this.frameTick >= this.animSpeed) {
            this.frameTick = 0;
            this.animationIndex++;

            // Retour au début si on dépasse la dernière image
            if (this.animationIndex >= this.frameCount) {
                this.animationIndex = 0;
            }
        }
    }

    draw() {
        if (!this.image.width) return;

        // 1. CALCUL DE LA LARGEUR D'UNE FRAME (Horizontal)
        // On divise la largeur totale de l'image par 5.
        const frameWidth = Math.floor(this.image.width / this.frameCount);

        // On prend toute la hauteur de l'image
        const frameHeight = this.image.height;

        // 2. POSITION X SUR LE SPRITE (On se déplace vers la droite)
        const sourceX = this.animationIndex * frameWidth;

        // 3. CENTRAGE VISUEL
        // Votre hitbox (collision) fait 100px de large (config).
        // Si l'image est plus large (ex: 120px), on la décale vers la gauche pour la centrer.
        const offsetX = (frameWidth - this.size.width) / 2;
        const offsetY = (frameHeight - this.size.height) / 2;

        const drawX = this.position.x - offsetX;
        const drawY = this.position.y - offsetY;

        theGame.ctx.drawImage(
            this.image,
            sourceX,            // On coupe à X variable
            0,                  // On part du haut de l'image (Y=0)
            frameWidth,         // Largeur d'une frame
            frameHeight,        // Hauteur totale
            drawX,              // Position X centrée
            drawY,              // Position Y centrée
            frameWidth,         // On garde la taille d'origine de l'image
            frameHeight
        );
    }
}