<script>
import { store } from './store.js';
import axios from 'axios';
export default {
  name: 'App',
  data() {
    return {
      store,
    }
  },
  methods: {
    getCurrentMovies() {
      const config = {
        method: 'get',
        url: 'https://api.themoviedb.org/3/search/movie',
        params: {
          api_key: this.store.API_KEY,
          query: this.store.queryString,
        }
      }

      axios(config)
        .then(resp => {
          console.log((resp.data));
          this.store.currentMovies = resp.data.results;
          console.log(this.store.currentMovies);
        })
        .catch(error => {
          console.log(error);
        })
    }
  },
  mounted() {
    this.getCurrentMovies()
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col" v-for="movie in store.currentMovies">
        <div class="movie-title">{{ movie.title }}</div>
        <div class="original-title">{{ movie.original_title }}</div>
        <div class="lang">{{ movie.origianl_language }}</div>
        <div class="vote-count">{{ movie.vote_count }}</div>
      </div>
    </div>
  </div>
</template>