'use strict';

function LJforce(distance) {

}

function wallForce(distance) {
    
}

function calcDistance(point1, point2) {
    return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2);
}

export default function calcNextParticleStates(particles, timeVariation, boxLengthX, boxLengthY) {
    const newParticlePoints = [];
    const newParticleVelocities = [];
    for(let i = 0; i<particles.value.length; i++) {
        let forceSum = 0;
        for(let j=0; i<particles.value.length; j++) {
            const distance = calcDistance(particles.value[i].point_, particles.value[j].point_);
            forceSum += LJforce(distance);
        }
        //TODO:
        const distanceFromWall = 0;

        newParticlePoints.push([,]);
        newParticleVelocities.push([,]);
    }
    return {
        points: newParticlePoints,
        velocities: newParticleVelocities
    };
}