<script>
import { store } from '../store.js';
import CardItem from '../components/CardItem.vue';
import KeenSlider from 'keen-slider';
export default {
  name: 'Home',
  data() {
    return {
      store,
      slider: null,
      upComingMovies: null,
      topRatedMovies: null,
      homeSections: ['upcoming', 'topRated'],
      sliders: {
        upcoming: null,
        topRated: null,
      },
      upcomingCurrentIndex: 0,
      topRatedCurrentIndex: 0,
    };
  },
  components: {
    CardItem,
  },
  methods: {
    async getUpcomingAndTopRated() {
      try {
        const response = await Promise.all([store.getUpcomingMovies(), store.getTopRatedMovies()]);
        this.upComingMovies = response[0].data?.results;
        this.topRatedMovies = response[1].data?.results.filter((_, index) => index < 10);
        //console.log(this.topRatedMovies);
        setTimeout(() => {
          store.loading = false;
          this.$nextTick(() => {
            this.homeSections.forEach((section) => {
              this.sliders[section] = new KeenSlider(this.$refs[`home-slider-${section}`], {
                slideChanged: (slider) => {
                  const currentIndex = slider.track.details.rel;
                  return section === 'upcoming' ? (this.upcomingCurrentIndex = currentIndex) : (this.topRatedCurrentIndex = currentIndex);
                },
                loop: false,
                mode: 'snap',
                renderMode: 'performance',
                dragSpeed: 1,
                slides: {
                  perView: 5,
                },
              });
            });
          });
        }, 500);
      } catch (err) {
        this.$router.push({ name: 'notFound' });
      }
    },
  },
  async mounted() {
    await this.getUpcomingAndTopRated();
    //console.log(this.upComingMovies);
  },
};
</script>
<template>
  <main id="site_main" class="min-vh-100 home">
    <div class="layover"></div>
    <div class="container-fluid upcoming pb-5 px-0 opacity-0" :class="upComingMovies ? 'opacity-100' : ''">
      <h2 class="home-title ms_white">Upcoming</h2>
      <div v-if="upComingMovies" class="slider-wrapper">
        <div class="icon-container prev" v-if="sliders['upcoming']">
          <font-awesome-icon :class="!upcomingCurrentIndex > 0 ? 'disabled' : ''" @click="sliders['upcoming'].prev()" class="prev-icon" icon="fa-solid fa-chevron-left" />
        </div>
        <div :ref="`home-slider-${homeSections[0]}`" class="keen-slider">
          <div v-for="(item, index) in upComingMovies">
            <div v-if="item.backdrop_path" class="home-slide" :class="'keen-slider__slide number-slide' + index" data-keen-slider-clickable="false">
              <card-item class="squared" :item="item" :movieOrTvKey="'movie'" />
            </div>
          </div>
        </div>
        <div class="icon-container next" v-if="sliders['upcoming']">
          <font-awesome-icon :class="upcomingCurrentIndex >= upComingMovies.length - 5 ? 'disabled' : ''" @click="sliders['upcoming'].next()" class="next-icon" icon="fa-solid fa-chevron-right" />
        </div>
      </div>
    </div>
    <section class="top-rated py-5">
      <div v-if="topRatedMovies" class="container-fluid px-0">
        <h2 class="home-title ms_white">Top rated</h2>
        <div v-if="topRatedMovies" class="slider-wrapper">
          <div class="icon-container prev" v-if="sliders['topRated']">
            <font-awesome-icon :class="!topRatedCurrentIndex > 0 ? 'disabled' : ''" @click="sliders['topRated'].prev()" class="prev-icon" icon="fa-solid fa-chevron-left" />
          </div>
          <div :ref="`home-slider-${homeSections[1]}`" class="keen-slider">
            <div v-for="(item, index) in topRatedMovies">
              <div v-if="item.backdrop_path" class="home-slide" :class="'keen-slider__slide number-slide' + index" data-keen-slider-clickable="false">
                <div :class="`ranking-${index + 1}`">
                  {{ index + 1 }}
                </div>
                <card-item :item="item" :movieOrTvKey="'movie'" />
              </div>
            </div>
          </div>
          <div class="icon-container next" v-if="sliders['topRated']">
            <font-awesome-icon :class="topRatedCurrentIndex >= topRatedMovies.length - 5 ? 'disabled' : ''" @click="sliders['topRated'].next()" class="next-icon" icon="fa-solid fa-chevron-right" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;
main {
  background-color: black;
  .layover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 1;
  }

  .upcoming {
    height: 100%;
    padding-top: 8rem;
    background: linear-gradient(to bottom, transparent, rgba(black, 1) 90%), url(../assets/img/home-top.jpg) no-repeat right;
    background-size: cover;
  }

  .top-rated {
    height: 100%;
    background: linear-gradient(to top, transparent, rgba(black, 1) 90%), url(../assets/img/home-bottom.jpg) no-repeat center;
    background-size: cover;
  }

  .upcoming,
  .top-rated {
    min-height: 50vh;
  }

  .slider-wrapper {
    padding-inline: calc(20px + 1.5rem);
    position: relative;

    &:hover {
      .icon-container {
        opacity: 1;
      }
    }
  }

  .home-title {
    position: relative;
    z-index: 1;
    padding-left: calc(20px + 1.75rem);
  }
  .keen-slider {
    position: relative;
    z-index: 1;
  }

  .upcoming .icon-container {
    height: calc(100% - 3rem);
  }

  .icon-container {
    position: absolute;
    background-color: rgba($color: $secondary, $alpha: 0.8);
    height: 100%;
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 50%;
    translate: 0 -50%;
    z-index: 3;
    border-radius: 0.5rem;
    transition: all 0.35s ease;

    &:hover {
      opacity: 1;
    }
  }

  .icon-container.prev {
    left: 0;
  }

  .icon-container.next {
    right: 0;
  }

  .prev-icon,
  .next-icon {
    color: $almost-white;
    width: 20px;
    padding-inline: 0.75rem;
    height: auto;
    font-weight: bold;
    transition: scale 0.2s ease;

    &:hover {
      scale: 1.15;
      cursor: pointer;
    }
  }

  .prev-icon.disabled,
  .next-icon.disabled {
    color: #424141;
    pointer-events: none;
    scale: 1;
  }

  .top-rated .keen-slider:not([data-keen-slider-disabled]) .keen-slider__slide {
    overflow: visible;
  }

  .home-slide {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 280px;

    [class^='ranking-'] {
      position: absolute;
      right: 50%;
      color: $secondary;
      font-size: 280px;
      font-weight: 900;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: #424141;
      letter-spacing: -2rem;
      line-height: 280px;
    }
    .ranking-10 {
      left: 0;
    }
  }
}
</style>
