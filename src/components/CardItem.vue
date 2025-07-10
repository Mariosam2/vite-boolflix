<script>
import { store } from '../store.js';
import CardInfo from './CardInfo.vue';
export default {
  name: 'itemItem',
  components: {
    CardInfo,
  },
  props: {
    item: Object,
    movieOrTvKey: String,
  },
  data() {
    return {
      store,
      votes: 5,
      cardDisplay: false,
      itemInfosDisplay: false,
      className: null,
    };
  },
  methods: {
    getValutation(num) {
      let valutation = Math.ceil(num / 2);
      return valutation;
    },
    onInfoClick(evt) {
      this.itemInfosDisplay = true;
      const currentId = evt.currentTarget.getAttribute('data-id');
      store.mountInfos(currentId, this.movieOrTvKey);
    },
    removeToWatchList() {
      const watchListItems = store.watchList.map((result) => result.item);
      document.body.classList.remove('noscroll');
      const itemIndex = watchListItems.indexOf(this.item);
      console.log(itemIndex);
      store.watchList.splice(itemIndex, 1);
      console.log(store.watchList);
    },
  },
};
</script>

<template>
  <div v-if="item && store[movieOrTvKey]" class="col" :class="store[movieOrTvKey].trendingTopTen.length > 0 && store[movieOrTvKey].trendingTopTen.includes(item.id) ? 'trending-item' : ''">
    <div :data-id="item.id" class="ms_card" @click="onInfoClick">
      <div class="layover"></div>
      <img class="card_img" :src="store.SMALLER_IMAGE_API_URL + item.poster_path" alt="" />
      <!-- :data-splide-lazy="store.SMALLER_IMAGE_API_URL + item.poster_path" -->
      <div class="d-flex">
        <font-awesome-icon class="p-2 info-icon" icon="fa-solid fa-circle-info" />
        <font-awesome-icon @click="removeToWatchList()" v-if="this.$route.name === 'watchList'" class="remove-icon m-2 p-1 ms-auto" icon="fa-solid fa-xmark" />
      </div>
      <card-info v-if="this.itemInfosDisplay" @closePopup="this.itemInfosDisplay = $event" :movieOrTvKey="this.movieOrTvKey" :item="item" :trailer="store.trailer" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

.squared .ms_card {
  aspect-ratio: 4/3;
}
.squared {
  padding: 1rem;
  @media screen and (min-width: 1200px) {
    padding: 1.5rem;
  }
}

.col {
  max-height: 100%;
}

.top-rated .home-slide .col {
  position: absolute;
  width: 50%;
  right: 0.75rem;
  top: 50%;
  translate: 0 -50%;
  padding-right: 0.2rem;
  max-height: 100%;
  @media screen and (min-width: 1200px) {
    right: 1.5rem;
  }
}

.ms_card {
  position: relative;
  aspect-ratio: 2/3;
  scale: 1;
  transition: scale 0.2s ease;
  cursor: pointer;
  @media screen and (min-width: 1440px) {
    &:hover {
      scale: 1.08;
    }
  }

  .card_img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.trending-item .ms_card::before {
  position: absolute;
  content: '';
  background: $darker-red;
  height: 28px;
  width: 28px;
  /* Added lines */
  top: 2rem;
  right: -0.45rem;
  transform: rotate(45deg);
}

.trending-item .ms_card::after {
  position: absolute;
  content: 'TOP 10';
  top: 0.4rem;
  right: -12.5px;
  padding: 0.5rem;
  background: $primary;
  z-index: 3;
  font-weight: 900;
  color: $almost-white;
}

.trending-item.watchlist .ms_card::before {
  top: calc(2rem + 20px + 1.5rem);
}

.trending-item.watchlist.trending-item .ms_card::after {
  top: calc(0.4rem + 20px + 1.5rem);
}
.layover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 2;
}

.visible {
  display: block;
}

.info-icon {
  width: 25px;
  height: 25px;
}

.remove-icon {
  cursor: pointer;
}

.info-icon,
.remove-icon {
  position: relative;
  z-index: 3;
  color: $almost-white;
}
.remove-icon {
  width: 20px;
  height: 20px;
  border: 1px solid $almost-white;
  border-radius: 50%;
}
</style>
