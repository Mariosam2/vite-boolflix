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
            <section class="movies">
                <div class="row row-cols-5 g-3">
                    <div class="col" v-for="movie in store.currentMovies">
                        <div class="movie">
                            <div class="movie-title">{{ movie.title }}</div>
                            <div class="original-title">{{ movie.original_title }}</div>
                            <div class="language">
                                <img v-if="movie.original_language == 'en'" src="../assets/img/us.png" alt="us" />
                                <img v-else-if="movie.original_language == 'es'" src="../assets/img/es.png" alt="us" />
                                <img v-else-if="movie.original_language == 'ja'" src="../assets/img/jp.png" alt="us" />
                                <div class="fw-bold text-uppercase" v-else>{{ movie.original_language }}</div>
                            </div>
                            <div class="vote-count">{{ movie.vote_count }}</div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="tv-shows">
                <div class="row row-cols-5 g-3">
                    <div class="col" v-for="show in store.currentShows">
                        <div class="show">
                            <div class="show-title">{{ show.title }}</div>
                            <div class="original-title">{{ show.original_title }}</div>

                            <div class="vote-count">{{ show.vote_count }}</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </main>
</template>

<style lang="scss">
.movie {
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
</style>


<!--  <img v-if="movie.original_language === 'en'" src="https://flagcdn.com/w20/us.png"
                                srcset="https://flagcdn.com/w40/us.png 2x" width="20" :alt="movie.original_language">
                            <img v-else-if="movie.original_language === 'ja'" src="https://flagcdn.com/h20/jp.png"
                                srcset="https://flagcdn.com/h20/jp.png 2x" width="20" :alt="movie.original_language">
                            <img v-else :src="'https://flagcdn.com/w20/' + movie.original_language + '.png'"
                                :srcset="'https://flagcdn.com/w40/' + movie.original_language + '.png 2x'" width="20"
                                :alt="movie.original_language"> -->