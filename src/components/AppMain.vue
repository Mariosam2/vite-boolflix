<script>
import { store } from '../store.js'
export default {
    name: 'AppMain',
    data() {
        return {
            store,
        }
    }
}
</script>

<template>
    <main id="site_main">
        <div class="container">
            <div class="row row-cols-5 g-3">
                <div class="col" v-for="movie in store.currentMovies">
                    <div class="movie">
                        <div class="movie-title">{{ movie.title }}</div>
                        <div class="original-title">{{ movie.original_title }}</div>
                        <img :src="'https://flagcdn.com/w20/' + movie.original_language + '.png'"
                            :srcset="'https://flagcdn.com/w40/' + movie.original_language + '.png 2x'" width="20"
                            :alt="movie.original_language">
                        <div class="vote-count">{{ movie.vote_count }}</div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="scss">
.movie {
    background-color: #ededed;
    height: 100%;
}
</style>