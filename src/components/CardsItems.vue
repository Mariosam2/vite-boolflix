<script>
import { store } from '../store.js';
import CardItem from './CardItem.vue';
import KeenSlider from 'keen-slider';
export default {
  name: 'CardsItems',
  props: {
    items: Object,
    trendingOrPopularKey: String,
    movieOrTvKey: String,
  },
  components: {
    CardItem,
  },
  data() {
    return {
      store,
      activeSlide: 0,
      container: null,
      slider: null,
    };
  },
  mounted() {
    this.slider = new KeenSlider(this.$refs[`card-items-slider-${this.trendingOrPopularKey}`], {
      loop: true,
      mode: 'free-snap',
      renderMode: 'performance',
      dragSpeed: 0.8,
      slides: {
        perView: 6,
      },
    });
  },
};
</script>
<template>
  <section class="container-fluid cards-items text-white my-3 px-0">
    <h2 class="ps-3 title">{{ trendingOrPopularKey === 'trending' ? 'best of today' : 'popular' }}</h2>
    <div :ref="`card-items-slider-${trendingOrPopularKey}`" class="keen-slider">
      <div style="max-width: 200px" :class="'keen-slider__slide number-slide' + index" v-for="(item, index) in items" data-keen-slider-clickable="false">
        <card-item :ref="`card-item-${item.id}`" :movieOrTvKey="this.movieOrTvKey" :item="item"></card-item>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.keen-slider {
  margin-top: 0.5rem;
  &:hover {
    cursor: grab;
  }
  &:active {
    cursor: grabbing;
  }
  overflow-y: visible;
  overflow-x: clip;

  .keen-slider__slide {
    overflow: visible;
    padding: 1rem;
  }
}
</style>
