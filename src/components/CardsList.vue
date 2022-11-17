<script>
import { store } from '../store.js';
import CardItem from './CardItem.vue';
export default {
    name: 'MoviesList',
    props: {
        list: Array,
    },
    components: {
        CardItem
    },
    data() {
        return {
            store,
        }
    }

}
</script>

<template>
    <section class="cards-list" v-if="list && list.length !== 0">
        <h2 v-if="list === store.currentMovies" class="title">Movies</h2>
        <h2 v-else class="title">Tv Series</h2>
        <div class="row mb-3 row-cols-1 row-cols-md-3 row-cols-xl-5 g-1 flex-nowrap">
            <card-item v-for="card in list" :card="card"></card-item>
        </div>
    </section>
</template>