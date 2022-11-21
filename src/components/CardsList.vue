<script>
import { store } from '../store.js';
import CardItem from './CardItem.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
library.add(faChevronLeft, faChevronRight)
export default {
    name: 'MoviesList',
    props: {
        list: Object,
        title: String
    },
    components: {
        CardItem, FontAwesomeIcon
    },
    data() {
        return {
            store,


        }
    },
    methods: {
        next() {

            if (this.title === 'movies') {
                this.store.activeMoviesPage++;
                if (store.activeMoviesPage < this.list.total_pages) {
                    this.store.callApi('movie')


                } else {
                    this.store.callApi('movie')

                }
            } else {
                this.store.activeShowsPage++;
                if (store.activeShowsPage < this.list.total_pages) {
                    this.store.callApi('tv')


                } else {
                    this.store.callApi('tv')

                }

            }
            this.$refs.pages.scrollIntoView(false);

        },
        prev() {
            if (this.title === 'movies') {
                this.store.activeMoviesPage--;
                if (store.activeMoviesPage > 1) {
                    this.store.callApi('movie')


                } else {
                    this.store.activeMoviesPage = 1;
                    this.store.callApi('movie')

                }
            } else {
                this.store.activeShowsPage--;
                if (store.activeShowsPage > 1) {
                    this.store.callApi('tv')


                } else {
                    this.store.activeShowsPage = 1;
                    this.store.callApi('tv')

                }

            }
            this.$refs.pages.scrollIntoView(false);




        },

    },


}
</script>

<template>
    <section class="cards-list text-white">
        <h2 v-if="title === 'movies'" class="title">Movies</h2>
        <h2 v-else class="title">Tv Series</h2>
        <div class="loading" v-if="store.loading">Loading...</div>
        <div class="row mb-3 row-cols-1 row-cols-md-3 row-cols-xl-5 g-2" v-else>
            <card-item v-for="card in list.results" :card="card"></card-item>
        </div>
        <div class="pages d-flex justify-content-center py-4 align-items-center" ref="pages"
            v-if="list.total_pages > 1">

            <font-awesome-icon class="prev fs-5" v-if="title === 'movies'" v-show="this.store.activeMoviesPage > 1"
                @click="prev" icon=" fa-solid fa-chevron-left" />
            <font-awesome-icon class="prev fs-5" v-show="this.store.activeShowsPage > 1" @click="prev"
                icon=" fa-solid fa-chevron-left" v-else />
            <div v-if="title === 'movies'">{{ store.activeMoviesPage + ' of ' + list.total_pages }}</div>
            <div v-else>{{ store.activeShowsPage + ' of ' + list.total_pages }}</div>
            <font-awesome-icon class="next fs-5" v-if="title === 'movies'"
                v-show="this.store.activeMoviesPage < list.total_pages" @click="next"
                icon=" fa-solid fa-chevron-right" />
            <font-awesome-icon class="next fs-5" v-show="this.store.activeShowsPage < list.total_pages" @click="next"
                icon=" fa-solid fa-chevron-right" v-else />


        </div>

    </section>
</template>

<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;


.next,
.prev {
    margin: 0 0.5rem;
    padding: 0.5rem;

    &:hover {
        cursor: pointer;
    }
}

.loading {
    padding: 5rem;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
}

.empty {
    color: $almost-white;
}
</style>