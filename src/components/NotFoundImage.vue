<script>
import { store } from '../store';
export default {
  name: 'NotFoundImage',
  data() {
    return {
      store,
    };
  },
};
</script>
<template>
  <div class="not-found mx-auto d-flex flex-column justify-content-center align-items-center ms_white">
    <div class="not-found-img">
      <img class="img-fluid" :src="store.getStaticImage('ghost-not-found.svg')" alt="" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.not-found-img {
  img {
    width: 60vw;
    height: auto;
  }
}

.not-found-title {
  font-size: 5rem;
  line-height: 1.2;
}
</style>
