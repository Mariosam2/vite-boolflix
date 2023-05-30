<script>
import { store } from '../store';

import SearchResults from '../components/SearchResults.vue';
export default {
  name: 'Search',
  components: {
    SearchResults,
  },
  data() {
    return {
      store,
    };
  },
  mounted() {
    if (window.localStorage.getItem('searchedResults') && window.localStorage.getItem('totalPages') && window.localStorage.getItem('currentPages')) {
      //console.log(JSON.parse(window.localStorage.getItem('totalPages')), JSON.parse(window.localStorage.getItem('searchedResults')));
      store.searchedResults = JSON.parse(window.localStorage.getItem('searchedResults'));
      store.searchedMoviesTotalPages = JSON.parse(window.localStorage.getItem('totalPages')).movies;
      store.searchedTvSeriesTotalPages = JSON.parse(window.localStorage.getItem('totalPages')).tv;
      store.currentMoviesPage = JSON.parse(window.localStorage.getItem('currentPages')).movies;
      store.currentTvSeriesPage = JSON.parse(window.localStorage.getItem('currentPages')).tv;
    }
    setTimeout(() => {
      store.loading = false;
    }, 500);
  },
};
</script>
<template ref="search-view">
  <main id="site_main" class="min-vh-100 ms_white bg_secondary">
    <div v-for="(items, itemsKey) in store.searchedResults">
      <div
        class="container-fluid px-2 px-md-5 pb-4"
        v-if="itemsKey === 'movies' ? store.searchedResults.movies !== null && store.searchedResults.movies.length > 0 : store.searchedResults.tv !== null && store.searchedResults.tv.length > 0"
        :class="itemsKey">
        <div class="heading d-flex">
          <h2 class="mb-0">{{ itemsKey === 'tv' ? 'tv series' : 'movies' }}</h2>
        </div>
        <search-results :items="items" :itemsKey="itemsKey === 'movies' ? 'movies' : 'tvSeries'" />
      </div>
    </div>
  </main>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;
main {
  .container-fluid.movies {
    padding-top: 8rem;
  }
  .container-fluid.tv {
    padding-top: 2rem;
  }
}
</style>
