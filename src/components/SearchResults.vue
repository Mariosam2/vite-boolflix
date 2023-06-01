<script>
import CardItem from './CardItem.vue';
import { store } from '../store';
export default {
  name: 'SearchResults',
  props: {
    items: Array,
    itemsKey: String,
  },
  components: {
    CardItem,
  },
  data() {
    return {
      store,
      currentPage: 1,
      totalPages: 1,
      toPage: '',
      invalidChars: ['-', '+', 'e', '.', ''],
    };
  },
  methods: {
    prevPage(key) {
      if (this.currentPage >= 1) {
        if (key === 'movies') {
          store.currentMoviesPage--;
        } else if (key === 'tvSeries') {
          store.currentTvSeriesPage--;
        }
        this.currentPage--;
      }
    },
    nextPage(key) {
      if (this.currentPage < this.totalPages) {
        if (key === 'movies') {
          store.currentMoviesPage++;
        } else if (key === 'tvSeries') {
          store.currentTvSeriesPage++;
        }
        this.currentPage++;
      }
    },
    goToPage(key) {
      console.log(this.toPage);
      if (parseInt(this.toPage) >= 1 && parseInt(this.toPage) <= this.totalPages) {
        console.log(this.toPage);
        const newPage = parseInt(this.toPage);
        //console.log(newPage);
        if (key === 'movies') {
          store.currentMoviesPage = newPage;
        } else if (key === 'tvSeries') {
          store.currentTvSeriesPage = newPage;
        }
        this.currentPage = newPage;
      }
      this.toPage = '';
    },
    checkInvalidChars(evt) {
      if (this.invalidChars.includes(evt.key)) {
        evt.preventDefault();
      }
    },
  },
  mounted() {
    this.currentPage = this.itemsKey === 'movies' ? store.currentMoviesPage : store.currentTvSeriesPage;
    this.totalPages = this.itemsKey === 'movies' ? store.searchedMoviesTotalPages : store.searchedTvSeriesTotalPages;
    //console.log(this.totalPages);
  },
  computed: {
    changeCurrentPage() {
      return this.itemsKey === 'movies' ? store.currentMoviesPage : store.currentTvSeriesPage;
    },
    changeTotalPages() {
      return this.itemsKey === 'movies' ? store.searchedMoviesTotalPages : store.searchedTvSeriesTotalPages;
    },
  },
  watch: {
    changeCurrentPage(newValue) {
      console.log(newValue);
      this.currentPage = newValue;
    },
    changeTotalPages(newValue) {
      console.log(newValue);
      this.totalPages = newValue;
    },
  },
};
</script>
<template>
  <div class="results row row-cols-1 row-cols-sm-2 row-cols-lg-4">
    <card-item
      :class="!store[`${itemsKey}Loading`] ? 'opacity-100' : 'opacity-0'"
      :ref="`card-item-${item.id}`"
      class="squared"
      v-for="item in items"
      :movieOrTvKey="itemsKey === 'movies' ? 'movie' : 'tv'"
      :item="item"></card-item>
    <div v-if="store[`${itemsKey}Loading`]" class="loader"></div>
  </div>
  <div class="pagination d-flex justify-content-center mt-2 flex-wrap" v-if="totalPages > 1">
    <div class="pagination d-flex flex-nowrap align-items-center my-3">
      <font-awesome-icon @click="prevPage(itemsKey)" id="prevMoviesIcon" class="fs-5 fw-bold mx-3" icon="fa-solid fa-chevron-left" />
      <div v-for="index in totalPages">
        <div class="page" :class="index === currentPage ? 'current' : ''" v-if="index === currentPage">
          {{ index }}
        </div>
      </div>
      <div class="d-flex align-items-baseline">
        <span class="mx-2">...</span>
        <div class="page">
          {{ totalPages }}
        </div>
      </div>
      <font-awesome-icon @click="nextPage(itemsKey)" id="nextMoviesIcon" class="fs-5 fw-bold mx-3" icon="fa-solid fa-chevron-right" />
    </div>
    <div class="go-to-page d-flex flex-nowrap align-items-center my-3">
      <span class="me-3">Go to page</span>
      <input type="number" name="page" id="goToPage" min="1" :max="totalPages" @keydown="checkInvalidChars($event)" v-model="toPage" @keyup.enter="goToPage(itemsKey)" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;
.movies-container,
.results {
  position: relative;
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
.ms_card .card_img {
  z-index: 0;
}

.page {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
}
#goToPage::-webkit-outer-spin-button,
#goToPage::-webkit-inner-spin-button {
  display: none;
}

#goToPage {
  width: 40px;
  height: 40px;
  text-align: center;
  outline: none;
  border: 1px solid $secondary;
}
.page.current {
  background-color: $almost-white;
  color: $secondary;
}
</style>
