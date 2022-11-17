<script>
import { store } from '../store.js';
import MovieItem from './MovieItem.vue';
export default {
    name: 'MoviesList',
    components: {
        MovieItem
    },
    data() {
        return {
            store,
        }
    }

}
</script>

<template>
    <section class="movies" v-if="store.currentMovies && store.currentMovies.length !== 0">
        <h2 class="title">Movies</h2>
        <div class="row my-3 row-cols-5 g-4">
            <movie-item v-for="movie in store.currentMovies" :movie="movie"></movie-item>
        </div>
    </section>
</template>