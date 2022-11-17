<script>
import { store } from '../store.js'
import MoviesList from './MoviesList.vue';
export default {
    name: 'AppMain',
    components: {
        MoviesList
    },
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
            <!-- Movies e Shows saranno due componenti con dentro un altro componente (movie e show) -->
            <movies-list></movies-list>
            <section class="tv-shows" v-if="store.currentShows && store.currentShows.length !== 0">
                <h2 class="title">Tv-Series</h2>
                <div class="row my-3 row-cols-5 g-3">
                    <div class="col" v-for="show in store.currentShows">
                        <div class="show">
                            <div class="show-name">{{ show.name }}</div>
                            <div class="original-name">{{ show.original_name }}</div>
                            <div class="language">
                                <img v-if="show.original_language == 'en'" src="../assets/img/us.png" alt="us" />
                                <img v-else-if="show.original_language == 'es'" src="../assets/img/es.png" alt="us" />
                                <img v-else-if="show.original_language == 'ja'" src="../assets/img/jp.png" alt="us" />
                                <div class="fw-bold text-uppercase" v-else>{{ show.original_language }}</div>
                            </div>
                            <div class="vote-count">{{ show.vote_average }}</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </main>
</template>

<style lang="scss">
.movie,
.show {
    background-color: #ededed;
    height: 100%;

    .language {
        img {
            width: 25px;
            aspect-ratio: 16/9;
            object-fit: cover;
        }
    }
}

.title {

    text-transform: uppercase;
    font-weight: bold;
}
</style>


<!--  <img v-if="movie.original_language === 'en'" src="https://flagcdn.com/w20/us.png"
                                srcset="https://flagcdn.com/w40/us.png 2x" width="20" :alt="movie.original_language">
                            <img v-else-if="movie.original_language === 'ja'" src="https://flagcdn.com/h20/jp.png"
                                srcset="https://flagcdn.com/h20/jp.png 2x" width="20" :alt="movie.original_language">
                            <img v-else :src="'https://flagcdn.com/w20/' + movie.original_language + '.png'"
                                :srcset="'https://flagcdn.com/w40/' + movie.original_language + '.png 2x'" width="20"
                                :alt="movie.original_language"> -->