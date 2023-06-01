<script>
import { store } from '../store.js';
import CardsItems from '../components/CardsItems.vue';
import CardInfo from '../components/CardInfo.vue';
export default {
  name: 'MoviesOrTvSeries',
  components: {
    CardsItems,
    CardInfo,
  },
  emits: ['logoLoaded'],
  data() {
    return {
      store,
      cardDisplay: false,
      trendingInfosDisplay: false,
      movieOrTvKey: null,
    };
  },
  methods: {
    onInfoClick(id) {
      this.trendingInfosDisplay = true;
      store.mountInfos(id, this.movieOrTvKey);
    },
    logoLoaded(event) {
      if (event.target.complete) {
        setTimeout(() => {
          store.loading = false;
        }, 500);
        console.log('image loaded');
      }
    },
  },
  watch: {
    async $route(newValue) {
      //console.log(newValue);
      newValue.name === 'movies'
        ? ((this.movieOrTvKey = 'movie'), await this.store.getTrendigAndPopular(this.movieOrTvKey))
        : ((this.movieOrTvKey = 'tv'), await this.store.getTrendigAndPopular(this.movieOrTvKey));
    },
  },
  async mounted() {
    this.$route.name === 'movies'
      ? ((this.movieOrTvKey = 'movie'), await this.store.getTrendigAndPopular(this.movieOrTvKey))
      : ((this.movieOrTvKey = 'tv'), await this.store.getTrendigAndPopular(this.movieOrTvKey));

    //console.log(store.trendingDetails, store.trendingLogo);
  },
};
</script>

<template>
  <main class="movies-tv-series min-vh-100 px-0 px-sm-3 px-lg-5 pb-5" v-if="store.homeResults">
    <div class="layover"></div>
    <div class="container-fluid ps-xl-3 position-relative">
      <div class="trending-content py-4">
        <div class="heading">
          <img @load="logoLoaded($event)" class="trending-logo py-2" v-if="store.trendingLogo" :src="'https://image.tmdb.org/t/p/w780/' + store.trendingLogo" alt="" />
          <h1 v-else class="m-0">{{ store.trendingResult.title || store.trendingResult.name }}</h1>
        </div>
        <div class="trending-top d-none d-md-flex align-items-center my-3 p-2 noto_sans">
          <span class="fw-bold fs-4 text-uppercase pe-2">
            {{ `${store.trendingResultIndex + 1}°` }}
          </span>
          <small>
            <font-awesome-icon icon="fa-solid fa-chart-simple" />
            24h
          </small>
        </div>
        <div class="cta d-flex align-items-center mt-3 mb-2 mb-md-1">
          <h1 class="b-logo mb-0 ps-0 d-none d-md-block">B</h1>
          <div class="info_btn d-flex align-items-center ms-1 ms-md-0" @click="onInfoClick(store.trendingResult.id)">
            <font-awesome-icon class="icon pe-2 fs-5" icon="fa-solid fa-circle-info" />
            More info
          </div>
          <div class="trending-top d-flex d-md-none align-items-center ms-3 p-2 noto_sans">
            <span class="fw-bold fs-4 text-uppercase pe-2">
              {{ `${store.trendingResultIndex + 1}°` }}
            </span>
            <small>
              <font-awesome-icon icon="fa-solid fa-chart-simple" />
              24h
            </small>
          </div>
        </div>

        <p class="overview">{{ store.trendingResult.overview }}</p>
        <card-info v-if="this.trendingInfosDisplay" @closePopup="this.trendingInfosDisplay = $event" :item="store.trendingResult" :trailer="store.trailer" :movieOrTvKey="this.movieOrTvKey" />
      </div>
    </div>

    <img v-if="store.trendingResult !== null" :src="store.ORIGINAL_IMAGE_API_URL + store.trendingResult.backdrop_path" alt="" class="bg-thumb" />
    <div v-if="store.homeResults" class="pb-3 d-flex flex-wrap align-items-center ms_container">
      <cards-items v-for="(items, trendingOrPopular) in store.results" :items="items" :movieOrTvKey="this.movieOrTvKey" :trendingOrPopularKey="trendingOrPopular"></cards-items>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

main.movies-tv-series {
  padding-top: 5rem;
  background: linear-gradient(to bottom, transparent 50%, $secondary 70%);
}

.visible {
  display: block;
}

.bg-thumb {
  position: absolute;
  width: 100%;
  height: 70%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  object-fit: cover;
  z-index: -2;
  object-position: center;
}

.trending-content {
  position: relative;
  color: $almost-white;
  max-width: 100%;

  @media screen and (min-width: 768px) {
    max-width: 60%;
  }

  @media screen and (min-width: 992px) {
    max-width: 40%;
  }
}

.trending-logo {
  width: auto;
  width: 100%;
  max-width: 400px;
  max-height: 350px;
  object-fit: contain;
}

.cta {
  .info_btn {
    background-color: rgba(#525253, 0.8);
  }

  .watchlist_btn {
    border: 1px solid $almost-white;
  }
}

.cta > * {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.b-logo {
  font-size: 52px;
  color: $primary;
  display: flex;
  line-height: 0.8;
  align-items: end;
}

.trending-top {
  width: fit-content;
  background-color: $primary;
}
.trending-content p {
  font-size: 1.1rem;
  font-weight: 500;
}

.trending-content h2 {
  font-weight: 900;
  white-space: nowrap;
}

.layover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color: #000000, $alpha: 0.6);
  z-index: -1;
}

.title {
  color: $almost-white;
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.cards-list {
  width: 100%;
}
</style>
