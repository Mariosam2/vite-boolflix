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
        <h2 class="title">Prova</h2>
        <div class="row my-3 row-cols-5 g-4">
            <card-item v-for="card in list" :card="card"></card-item>
        </div>
    </section>
</template>