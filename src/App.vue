<script>
import { store } from './store';
import AppHeader from './components/AppHeader.vue';
export default {
  name: 'App',
  components: {
    AppHeader,
  },
  data() {
    return {
      store,
      logoLoaded: false,
    };
  },
  computed: {
    watchList() {
      return store.watchList.length;
    },
  },
  mounted() {
    this.store.getTrendingTopTen('movie');
    this.store.getTrendingTopTen('tv');
  },

  watch: {
    watchList(newValue) {
      console.log(newValue);
      window.localStorage.setItem('watchlist', JSON.stringify(store.watchList));
    },
  },
};
</script>

<template>
  <app-header></app-header>
  <router-view :class="!store.loading ? ' ms_visible' : ' ms_hidden'"></router-view>
  <main id="loader" class="min-vh-100" v-show="store.loading">
    <div class="loader"></div>
  </main>
</template>

<style lang="scss" scoped>
@use './assets/scss/partials/variables' as *;
//I'm using this method to let the carousel mount (with display none the keen slider is not able to mount properly)
.ms_visible {
  visibility: visible;
  position: relative;
}
.ms_hidden {
  visibility: hidden;
  height: 100vh;
  overflow: hidden;
}
main#loader {
  position: fixed;
  width: 100%;
  top: 0;
  background-color: $secondary;
}
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid $primary;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  z-index: 99999;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
