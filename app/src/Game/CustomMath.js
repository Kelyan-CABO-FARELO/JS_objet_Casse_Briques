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

    // Normalisation d'un angle
    static normalizeAngle( value, isRadian = false ){
        const fullCircle = isRadian ? 2 * Math.PI : 360;
        value %= 360;

        if (value >= 0) return value;

        value += fullCircle;

        return value;
    }
}