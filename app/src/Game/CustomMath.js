export default class CustomMath
{
    // Conversion d'angle : Degrès => Radian
    static degToRad(degValue){
        return degValue * (Math.PI / 180);
    }

    // Conversion d'angle : Radian => Dégrès
    static radToDeg(radValue){
        return radValue * (180 / Math.PI);
    }
}