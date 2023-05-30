<script>
import { store } from '../store';
import NotFoundImage from '../components/NotFoundImage.vue';
export default {
  name: 'NotFound',
  data() {
    return {
      store,
    };
  },
  components: {
    NotFoundImage,
  },
  mounted() {
    console.log('not found mounted');
    store.loading = false;
  },
};
</script>
<template>
  <main id="site_main" class="min-vh-100 bg_secondary">
    <not-found-image />
  </main>
</template>
<style lang="scss" scoped>
main {
  display: grid;
  place-items: center;
}
</style>
