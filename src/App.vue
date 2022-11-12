<script setup>
import TurntableAward from './components/turntableAward/index.vue'
import { getData } from './apis/award'
import { onMounted, ref } from 'vue';
const list = ref([])

onMounted(async () => {

})
</script>

<template>
  <header>
    <div class="wrapper">
    </div>
  </header>

  <main>
    <TurntableAward />
  </main>
</template>

<style scoped>

</style>
