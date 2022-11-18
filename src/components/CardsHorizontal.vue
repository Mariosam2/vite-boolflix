<script>
import { store } from '../store.js'
import CardItem from './CardItem.vue'
export default {
    name: 'CardsHorizontal',
    props: {
        list: Object,
        title: String,
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
    <section class="cards-list text-white">
        <h2 v-if="title === 'trending'" class="title">Trending</h2>
        <h2 v-else class="title">Popular</h2>
        <div class="loading" v-if="store.loading">Loading...</div>
        <div class="row mb-3 row-cols-1 row-cols-md-3 row-cols-xl-5 g-1" v-else>
            <card-item v-for="card in list.results" :card="card"></card-item>
        </div>

    </section>
</template>

<style lang="scss" scoped>
.row {
    flex-wrap: nowrap;
    overflow-x: auto;

    .col {
        margin-bottom: 0.5rem;
    }
}
</style>