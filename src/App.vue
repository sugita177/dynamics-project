<script setup>
import { ref, onMounted } from 'vue';
import calcNextParticleStates from './calculation.js';

//const mousePointX = ref(0);
//const mousePointY = ref(0);

const mainCanvasOperationPossible = ref([true]);
const particles = ref([]);
const isParticleSelected = ref(false);
const selectedParticleNumber =ref(-1);
const mainCanvasColor = ref('#dcdcdc');
const timerId = ref('1');

onMounted(() => {
  const canvas = document.querySelector('#mainCanvas');
  const context = canvas.getContext('2d');
  context.beginPath();
  context.fillStyle = mainCanvasColor.value;
  context.fillRect(0,0,canvas.width, canvas.height);
})

class Particle {
  point_;
  radius_;
  color_;
  velocity_;
  mass_;
  prevPoint_;
  setVelocity_;

  constructor(point, radius, color) {
    this.point_  = point;
    this.radius_ = radius;
    this.color_  = color;
    this.prevPoint_ = point;
    this.setVelocity_ = false;
  }

  drawSelfParticle(context, offset) {
    //console.log(this.point_);
    context.beginPath();
    context.strokeStyle = this.color_;
    context.fillStyle = this.color_;
    context.arc(-offset[0] + this.point_[0], -offset[1] + this.point_[1], this.radius_, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.closePath();
  }

  removeSelfParticleDrawing(context, offset) {
    context.beginPath();
    context.strokeStyle = mainCanvasColor.value;
    context.fillStyle = mainCanvasColor.value;
    context.arc(-offset[0] + this.point_[0], -offset[1] + this.point_[1], this.radius_+context.lineWidth, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
    context.closePath();
  }


  removePrevSelfParticleDrawing(context, offset) {
      context.beginPath();
      context.strokeStyle = mainCanvasColor.value;
      context.fillStyle = mainCanvasColor.value;
      context.arc(-offset[0] + this.prevPoint_[0], -offset[1] + this.prevPoint_[1], this.radius_+context.lineWidth, 0, 2 * Math.PI);
      context.stroke();
      context.fill();
      context.closePath();
  }
}

const createParticle = e => {
  //console.log(e.clientX, e.clientY);
  if(isParticleSelected.value === false) {
    const particlePoint = [e.clientX, e.clientY];
  const particle = new Particle(particlePoint, 20, 'green');
  particles.value.push(particle);
  const context = e.target.getContext('2d');
  const canvasOffSet = [
    e.target.getBoundingClientRect().left,
    e.target.getBoundingClientRect().top
  ]
  particle.drawSelfParticle(context, canvasOffSet);
  }
}

const isExistPatricle = e => {
  for(let i=0; i<particles.value.length; i++) {
    const distanceFromPrticle = Math.sqrt((e.clientX - particles.value[i].point_[0])**2 + (e.clientY - particles.value[i].point_[1])**2);
    //console.log(`particle${i}:${distanceFromPrticle}`);
    if(distanceFromPrticle <= particles.value[i].radius_) {
      isParticleSelected.value = true;
      selectedParticleNumber.value = i;
      const context = e.target.getContext('2d');
      const canvasOffSet = [
        e.target.getBoundingClientRect().left,
        e.target.getBoundingClientRect().top
      ]
      //particles.value[i].removeSelfParticleDrawing(context,canvasOffSet);
      //console.log(e.clientX, e.clientY);
      //console.log(`particle${i}`);
    }
  }
}

const drawMovingParticle = e => {
  if(isParticleSelected.value) {
    const particle = particles.value[selectedParticleNumber.value];
    const mousePoint = [e.clientX, e.clientY]
    particle.point_ = [mousePoint[0], mousePoint[1]];
    const context = e.target.getContext('2d');
    const canvasOffSet = [
    e.target.getBoundingClientRect().left,
    e.target.getBoundingClientRect().top
    ]
    particle.removePrevSelfParticleDrawing(context,canvasOffSet);
    particle.drawSelfParticle(context, canvasOffSet);
    particle.prevPoint_ = [mousePoint[0], mousePoint[1]];
  }
}

const moveParticleByMouse = e => {
  if(isParticleSelected.value) {
    const particle = particles.value[selectedParticleNumber.value];
    particle.point_ = [e.clientX, e.clientY];
    const context = e.target.getContext('2d');
    const canvasOffSet = [
    e.target.getBoundingClientRect().left,
    e.target.getBoundingClientRect().top
    ]
    particle.drawSelfParticle(context, canvasOffSet);
    isParticleSelected.value = false;
    selectedParticleNumber.value = -1;
  }
}

const drawAllParticles = e => {
  const canvas = document.querySelector('#mainCanvas');
  const context = canvas.getContext('2d');
  const canvasOffSet = [
    canvas.getBoundingClientRect().left,
    canvas.getBoundingClientRect().top
    ]
  for(let i=0; i<particles.value.length; i++) {
    const particle = particles.value[i];
    particle.drawSelfParticle(context , canvasOffSet) 
  }
}

function setInitialVelocities() {
  for(let i=0; i<particles.value.length; i++) {
    if(particles.value[i].setVelocity_ === true) {
      particles.value[i].velocity_[0] = Math.random() * 50;
      particles.value[i].velocity_[1] = Math.random() * 50;      
    }
  }
}

function moveParticlesByEquation() {
  setInitialVelocities();
  //particles.value = calcNextParticleStates(particles.value);
}

const startAnimation = e => {
  mainCanvasOperationPossible.value = false;
  document.querySelector('#startButton').disabled = true;
  document.querySelector('#stopButton').disabled = false;
  timerId.value = setInterval(moveParticlesByEquation, 1000);
}

const stopAnimation = e => {
  mainCanvasOperationPossible.value = true;
  document.querySelector('#startButton').disabled = false;
  document.querySelector('#stopButton').disabled = true;
  clearInterval(timerId.value);
}

const mainCanvasClick = e => {
  if(mainCanvasOperationPossible.value){
    createParticle(e);
  }
}

const mainCanvasMouseDown = e => {
  if(mainCanvasOperationPossible.value){
    isExistPatricle(e);
  }
}

const mainCanvasMouseMove = e => {
  if(mainCanvasOperationPossible.value){
    drawMovingParticle(e);
  }
}

const mainCanvasMouseUp = e => {
  if(mainCanvasOperationPossible.value){
    moveParticleByMouse(e);
  }
}

</script>

<template>
  <main>
    <div>
      <button id="arrangeButton" type="button" @click="">arrange</button>
      <button id="removeButton"  type="button" @click="">remove </button>
      <button id="startButton"   type="button" @click="startAnimation">start  </button>
      <button id="stopButton"    type="button" @click="stopAnimation" disabled>stop   </button>
    </div>
    <canvas width="1000" height="1000"
      id="mainCanvas"
      @click     ="mainCanvasClick" 
      @mousedown ="mainCanvasMouseDown"
      @mousemove ="mainCanvasMouseMove"
      @mouseup   ="mainCanvasMouseUp"
    >
    </canvas>
  </main>
</template>

<style scoped>
button {
  cursor: pointer;
}
</style>
