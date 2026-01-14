import GameObject from "./GameObject";
import theGame from "./Game"; // Nécessaire pour accéder au contexte (ctx)

export default class Edge extends GameObject
{
    constructor(image, width, height) {
        super(image, width, height);
    }

    draw() {
        // Sauvegarde l'état du contexte (pour ne pas affecter les autres objets)
        theGame.ctx.save();

        // Crée un motif répétitif avec l'image
        const pattern = theGame.ctx.createPattern(this.image, 'repeat');
        theGame.ctx.fillStyle = pattern;

        // Déplace l'origine du dessin à la position de l'objet
        // C'est CRUCIAL pour que le motif commence bien au coin du mur
        theGame.ctx.translate(this.position.x, this.position.y);

        // Dessine un rectangle rempli avec le motif
        // On dessine à 0,0 car on a déjà décalé le contexte avec translate
        theGame.ctx.fillRect(0, 0, this.size.width, this.size.height);

        // Restaure l'état du contexte (annule le translate)
        theGame.ctx.restore();
    }
}