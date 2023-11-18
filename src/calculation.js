'use strict';

function LJforce(pointStart, pointEnd) {
    const distance = calcDistance(pointStart, pointEnd);
    const eps = 10**(-1);
    const sigma = 20 / 2**(1/6);
    const LJforce = 4 * eps * (12 * sigma**(12) / distance**(13) - 6 * 12 * sigma**(6) / distance**(7));
    const LJforceX = LJforce * (pointEnd[0] - pointStart[0]) / distance;
    const LJforceY = LJforce * (pointEnd[1] - pointStart[1]) / distance;
    return [LJforceX, LJforceY];
}

function wallForce(distance) {
    const eps = 10**(-1);
    const sigma = 20 / 2**(1/6);
    const wallForce = 4 * eps * (12 * sigma**(12) / distance**(13));
    return wallForce;
}

function calcDistance(point1, point2) {
    return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2);
}

function calcWallForceSum(point, boxLengthX, boxLengthY, canvasOffset) {
    const wallForceByLeft = wallForce(Math.abs(point[0] - canvasOffset[0]));
    const wallForceByRight = wallForce(Math.abs(point[0] - canvasOffset[0] - boxLengthX));
    const wallForceByTop = wallForce(Math.abs(point[1] - canvasOffset[1]));
    const wallForceByBottom = wallForce(Math.abs(point[1] - canvasOffset[1] - boxLengthY));
    return [wallForceByLeft - wallForceByRight, wallForceByTop - wallForceByBottom];
}

export default function calcNextParticleStates(particlesValue, timeVariation, boxLengthX, boxLengthY, canvasOffset) {
    const newParticlePoints = [];
    const newParticleVelocities = [];
    for(let i = 0; i<particlesValue.length; i++) {
        let forceSumX = 0;
        let forceSumY = 0;
        for(let j=0; j<particlesValue.length; j++) {
            if(j === i){
                continue;
            }
            //const distance = calcDistance(particlesValue[i].point_, particlesValue[j].point_);
            const forceVector = LJforce(particlesValue[i].point_, particlesValue[j].point_);
            forceSumX += forceVector[0];
            forceSumY += forceVector[1];
        }
        const wallForceVector = calcWallForceSum(particlesValue[i].point_, boxLengthX, boxLengthY, canvasOffset);
        forceSumX += wallForceVector[0];
        forceSumY += wallForceVector[1];
        const newVelocityX = particlesValue[i].velocity_[0] + forceSumX * timeVariation;
        const newVelocityY = particlesValue[i].velocity_[1] + forceSumY * timeVariation;
        const newPointX    = particlesValue[i].point_[0] + newVelocityX * timeVariation;
        const newPointY    = particlesValue[i].point_[1] + newVelocityY * timeVariation;
        newParticlePoints.push([newPointX, newPointY]);
        newParticleVelocities.push([newVelocityX, newVelocityY]);
    }
    return {
        points: newParticlePoints,
        velocities: newParticleVelocities
    };
}