<script setup>
import { ref } from 'vue';

//const mousePointX = ref(0);
//const mousePointY = ref(0);
const particlePoints = ref([]);

const createParticle = e => {
  //console.log(e.clientX, e.clientY);
  const point = [e.clientX, e.clientY];
  particlePoints.value.push(point);
  //console.log(e.target);
  const context = e.target.getContext('2d');
  const canvasLeftTop = [
    e.target.getBoundingClientRect().left,
    e.target.getBoundingClientRect().top
  ]
  drawParticle(context, point, 20, canvasLeftTop);
}

const drawParticle = (context, point, radius, origin) => {
  context.beginPath();
  context.arc(-origin[0] + point[0], -origin[1] + point[1], radius, 0, 2 * Math.PI);
  context.fill();
}

</script>

<template>
  <main>
    <canvas width="600" height="400" @click="createParticle">
    </canvas>
  </main>
</template>

<style scoped>

</style>
