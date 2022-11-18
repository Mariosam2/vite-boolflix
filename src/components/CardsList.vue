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
            this.store.activePage++;
            this.store.callSearchApi('movie')
        }
    }

}
</script>

<template>
    <section class="cards-list text-white" v-if="list.results && list.results.length !== 0">
        <h2 v-if="title === 'movies'" class="title">Movies{{ store.activePage }}</h2>
        <h2 v-else class="title">Tv Series</h2>
        <div class="row mb-3 row-cols-1 row-cols-md-3 row-cols-xl-5 g-2">
            <card-item v-for="card in list.results" :card="card"></card-item>
            <div class="pages">
                <button class="btn btn-primary" @click="prev">Prev</button>
                <button class="btn btn-primary" @click="next">next</button>
            </div>
        </div>


    </section>
</template>