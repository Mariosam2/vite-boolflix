<script>
import { store } from '../store.js';
import CardItem from './CardItem.vue';
export default {
    name: 'MoviesList',
    props: {
        list: Object,
        title: String
    },
    components: {
        CardItem
    },
    data() {
        return {
            store,

        }
    },
    methods: {
        next() {
            let index = 0;
            if (this.title === 'movies') {
                ++this.store.activeMoviesPage;
                index = this.store.activeMoviesPage
                this.store.callSearchApi('movie')
            } else {
                ++this.store.activeShowsPage;
                index = this.store.activeShowsPage
                this.store.callSearchApi('tv')
            }
            console.log(index)
            if (index > this.list.total_pages) {
                //dovrei controllare entrambi i counter
                this.store.activePage = 1;
            }

        },
        prev() {
            let index = 0;
            if (this.title === 'movies') {
                --this.store.activeMoviesPage;
                index = this.store.activeMoviesPage
                this.store.callSearchApi('movie')
            } else {
                --this.store.activeShowsPage;
                index = this.store.activeShowsPage
                this.store.callSearchApi('tv')
            }
            console.log(index)
            if (index < 1) {
                //dovrei controllare entrambi i counter
                this.store.activePage = this.list.total_pages;
            }



        }
    }

}
</script>

<template>
    <section class="cards-list text-white" v-if="list.results && list.results.length !== 0">
        <h2 v-if="title === 'movies'" class="title">Movies</h2>
        <h2 v-else class="title">Tv Series</h2>
        <div class="loading" v-if="store.loading">Loading...</div>
        <div class="row mb-3 row-cols-1 row-cols-md-3 row-cols-xl-5 g-2" v-else>
            <card-item v-for="card in list.results" :card="card"></card-item>
        </div>
        <div class="pages" v-if="list.total_pages > 1">
            <button class="btn btn-primary" @click="prev">Prev</button>
            <div v-if="title === 'movies'">{{ store.activeMoviesPage }}</div>
            <div v-else>{{ store.activeShowsPage }}</div>
            <button class="btn btn-primary" @click="next">next</button>
        </div>

    </section>
</template>

<style lang="scss" scoped>
.loading {
    padding: 5rem;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
}
</style>