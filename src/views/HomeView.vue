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
      upcomingSlidesPerView: null,
      topRatedSlidesPerView: null,
    };
  },
  components: {
    CardItem,
  },
  methods: {
    async getUpcomingAndTopRated() {
      try {
        const response = await Promise.all([store.getUpcomingMovies(), store.getTopRatedMovies()]);
        this.upComingMovies = response[0].data?.results.filter((item) => item.backdrop_path !== null);
        this.topRatedMovies = response[1].data?.results.filter((_, index) => index < 10);
        //console.log(this.topRatedMovies);
        setTimeout(() => {
          store.loading = false;
          this.$nextTick(() => {
            this.homeSections.forEach((section) => {
              this.sliders[section] = new KeenSlider(this.$refs[`home-slider-${section}`], {
                slideChanged: (slider) => {
                  const currentIndex = slider.track.details.rel;
                  console.log(currentIndex);
                  return section === 'upcoming' ? (this.upcomingCurrentIndex = currentIndex) : (this.topRatedCurrentIndex = currentIndex);
                },
                created: (slider) => {
                  //console.log(slider);
                  return section === 'upcoming' ? (this.upcomingSlidesPerView = slider.options.slides.perView) : (this.topRatedSlidesPerView = slider.options.slides.perView);
                },
                optionsChanged: (slider) => {
                  //console.log(this.upcomingSlidesPerView, this.topRatedSlidesPerView);
                  return section === 'upcoming' ? (this.upcomingSlidesPerView = slider.options.slides.perView) : (this.topRatedSlidesPerView = slider.options.slides.perView);
                },
                loop: false,
                mode: 'snap',
                renderMode: 'performance',
                dragSpeed: 1,
                slides: {
                  perView: 1,
                },
                breakpoints: {
                  '(min-width: 540px)': {
                    slides: {
                      perView: 2,
                    },
                  },
                  '(min-width: 768px)': {
                    slides: {
                      perView: 3,
                    },
                  },
                  '(min-width: 1600px)': {
                    slides: {
                      perView: 4,
                    },
                  },
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
    <div class="container-fluid upcoming pb-3 pb-md-5 px-0 opacity-0" :class="upComingMovies ? 'opacity-100' : ''">
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
          <font-awesome-icon
            :class="upcomingSlidesPerView !== null && upcomingCurrentIndex >= upComingMovies.length - upcomingSlidesPerView ? 'disabled' : ''"
            @click="sliders['upcoming'].next()"
            class="next-icon"
            icon="fa-solid fa-chevron-right" />
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
            <font-awesome-icon
              :class="topRatedSlidesPerView !== null && topRatedCurrentIndex >= topRatedMovies.length - topRatedSlidesPerView ? 'disabled' : ''"
              @click="sliders['topRated'].next()"
              class="next-icon"
              icon="fa-solid fa-chevron-right" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;
main {
  background: linear-gradient(to bottom, rgba(black, 1), transparent, rgba(black, 1)), url(../assets/img/home-top.jpg) no-repeat top, url(../assets/img/home-bottom.jpg) no-repeat bottom;
  background-size: 100% 50%;
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
    padding-top: 5rem;
    @media screen and (min-width: 540px) {
      padding-top: 8rem;
    }
  }

  .slider-wrapper {
    @media screen and (min-width: 1200px) {
      padding-inline: calc(20px + 1.5rem);
    }
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
    padding-left: 0.75rem;
    @media screen and (min-width: 1200px) {
      padding-left: calc(20px + 1.75rem);
    }
  }
  .keen-slider {
    position: relative;
    z-index: 1;
    overflow-y: visible;
    overflow-x: clip;
  }

  .upcoming .icon-container {
    @media screen and (min-width: 992px) {
      height: calc(100% - 1.5rem);
    }
  }

  .top-rated .icon-container {
    height: 20vw;
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
    display: none;

    @media screen and (min-width: 1200px) {
      display: flex;
      align-items: center;
    }

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
    width: 300px;
  }
  .top-rated .home-slide {
    padding: 0.75rem;
    @media screen and (min-width: 1200px) {
      padding: 1.5rem;
    }
  }
  .home-slide {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;

    [class^='ranking-'] {
      color: $secondary;
      font-size: 60vw;
      font-weight: 900;
      -webkit-text-stroke-width: 4px;
      -webkit-text-stroke-color: #676666;
      letter-spacing: -2vw;
      line-height: 70vw;
      @media screen and (min-width: 540px) {
        font-size: 30vw;
        line-height: 40vw;
      }
      @media screen and (min-width: 768px) {
        font-size: 20vw;
        line-height: 25vw;
      }
    }
    .ranking-1 {
      @media screen and (min-width: 1200px) {
        right: 55%;
      }
    }

    .ranking-10 {
      left: 0;
    }
  }
}
</style>
