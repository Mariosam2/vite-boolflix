<script>
import AppMain from './components/AppMain.vue'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'App',
  components: {
    AppMain, AppHeader
  },

}
</script>

<template>
  <app-header></app-header>
  <app-main></app-main>
</template>