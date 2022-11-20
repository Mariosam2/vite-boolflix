<script>
import { store } from '../store.js'
import CardsList from './CardsList.vue';
import CardsHorizontal from './CardsHorizontal.vue';
export default {
    name: 'AppMain',
    components: {
        CardsList, CardsHorizontal
    },
    data() {
        return {
            store,
        }
    },
    mounted() {
        this.store.callApi('getAll')
    }
}
</script>

<template>
    <main id="site_main" v-if="!store.loading">
        <div class="container-xl px-5 px-md-3 px-xl-0 pb-3 d-flex flex-wrap align-items-center ms_container"
            v-if="(store.resultsGet.popular && store.resultsGet.trending) && !store.searching">
            <cards-horizontal v-for="(data, key) in store.resultsGet" :list="data" :title="key">
            </cards-horizontal>
        </div>
        <div class="container-xl px-5 px-md-3 px-xl-0 pb-3 d-flex flex-wrap align-items-center ms_container"
            v-if="(store.resultsSearch.movies && store.resultsSearch.shows) && store.searching">
            <cards-list v-show="data.results.length !== 0" v-for="(data, key) in store.resultsSearch" :list="data"
                :title="key">
            </cards-list>


        </div>
    </main>
</template>

<style lang="scss">
@use '../assets/scss/partials/variables' as *;

.container-xl.ms_container {
    margin-top: 5rem;
}

.cards-list {
    width: 100%;
}


/* .col {
    scroll-snap-align: start;
} */


.ms_card {
    position: relative;
    aspect-ratio: 2/3;
    height: 100%;

    &:hover .content {
        opacity: 1;
    }

}

.cover {
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
}



.content,
.content.show {
    color: $almost-white;
    overflow-y: auto;
    background-color: $dark;
    padding: 1rem;

    >* {
        margin-top: 0.5rem;
    }
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
    color: $almost-white;
    text-transform: uppercase;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
}
</style>


<!--  <img v-if="movie.original_language === 'en'" src="https://flagcdn.com/w20/us.png"
                                srcset="https://flagcdn.com/w40/us.png 2x" width="20" :alt="movie.original_language">
                            <img v-else-if="movie.original_language === 'ja'" src="https://flagcdn.com/h20/jp.png"
                                srcset="https://flagcdn.com/h20/jp.png 2x" width="20" :alt="movie.original_language">
                            <img v-else :src="'https://flagcdn.com/w20/' + movie.original_language + '.png'"
                                :srcset="'https://flagcdn.com/w40/' + movie.original_language + '.png 2x'" width="20"
                                :alt="movie.original_language"> -->