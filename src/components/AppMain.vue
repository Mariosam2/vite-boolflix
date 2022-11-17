<script>
import { store } from '../store.js'
import CardsList from './CardsList.vue';

export default {
    name: 'AppMain',
    components: {
        CardsList,
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
            <cards-list :list="store.currentMovies"></cards-list>
            <cards-list :list="store.currentShows"></cards-list>

        </div>
    </main>
</template>

<style lang="scss">
.ms_card {
    position: relative;

    &:hover .content {
        opacity: 1;
    }

}

.cover {
    aspect-ratio: 2/3;
    object-fit: cover;
    object-position: center;
}

.content,
.content.show {
    overflow: auto;
    background-color: #ededed;
}

.content.show {
    opacity: 1;
}

.content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.2s ease;


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