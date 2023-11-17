<script setup>
import { ref, onMounted } from 'vue';

//const mousePointX = ref(0);
//const mousePointY = ref(0);

const particles = ref([]);
const isParticleSelected = ref(false);
const selectedParticleNumber =ref(-1);
const mainCanvasColor = ref('#dcdcdc');

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

  constructor(point, radius, color) {
    this.point_  = point;
    this.radius_ = radius;
    this.color_  = color;
  }

  drawSelfParticle(context, offset) {
    //console.log(this.point_);
    context.beginPath();
    context.fillStyle = this.color_;
    context.arc(-offset[0] + this.point_[0], -offset[1] + this.point_[1], this.radius_, 0, 2 * Math.PI);
    context.fill();
  }

  removeSelfParticleDrawing(context, offset) {
    context.beginPath();
    context.strokeStyle = mainCanvasColor.value;
    context.fillStyle = mainCanvasColor.value;
    context.arc(-offset[0] + this.point_[0], -offset[1] + this.point_[1], this.radius_, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
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
      particles.value[i].removeSelfParticleDrawing(context,canvasOffSet);
      //console.log(e.clientX, e.clientY);
      //console.log(`particle${i}`);
    }
  }
}

const drawMovingParticle = e => {
  if(isParticleSelected.value) {
    const particle = particles.value[selectedParticleNumber.value];
    particle.point_ = [e.clientX, e.clientY];
    const context = e.target.getContext('2d');
    const canvasOffSet = [
    e.target.getBoundingClientRect().left,
    e.target.getBoundingClientRect().top
    ]
    particle.removeSelfParticleDrawing(context,canvasOffSet);
    particle.drawSelfParticle(context, canvasOffSet);
  }
}

const moveParticle = e => {
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

</script>

<template>
  <main>
    <canvas width="1000" height="1000"
      id="mainCanvas"
      @click="createParticle" 
      @mousedown="isExistPatricle" 
      @mousemove="drawMovingParticle" 
      @mouseup="moveParticle"
    >
    </canvas>
  </main>
</template>

<style scoped>

</style>
