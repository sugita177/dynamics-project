<script setup>
import { ref } from 'vue';

//const mousePointX = ref(0);
//const mousePointY = ref(0);
const particlePoints = ref([]);

const createParticle = e => {
  console.log(e.clientX, e.clientY);
  particlePoints.value.push([e.clientX, e.clientY]);
  console.log(particlePoints.value);
}

const drawParticle = (Point) => {
  ;
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
