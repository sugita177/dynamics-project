<script setup>
import { ref } from 'vue';

//const mousePointX = ref(0);
//const mousePointY = ref(0);

class particle {
  point_;
  radius_;
  color_;

  constructor(point, radius, color) {
    this.point_  = point;
    this.radius_ = radius;
    this.color_  = color;
  }

  drawParticle() {
    
  }
}



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
