<script>
import { store } from '../store.js'
import ShowItem from './ShowItem.vue';
export default {
    name: 'ShowsList',
    components: {
        ShowItem,
    },
    data() {
        return {
            store,
        }
    }

}
</script>
<template>
    <section class="tv-shows" v-if="store.currentShows && store.currentShows.length !== 0">
        <h2 class="title">Tv-Series</h2>
        <div class="row my-3 row-cols-5 g-3">
            <show-item v-for="show in store.currentShows" :show="show"></show-item>
        </div>
    </section>
</template>