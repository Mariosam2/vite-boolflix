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
    },
    methods: {
        autoScroll() {
            let element = this.$refs.card;
            let maxWidth = element.scrollWidth - element.offsetWidth;
            let step = 500;
            let currentWidth = 0;
            console.log(maxWidth)
            setInterval(() => {
                //console.log(element)
                if (!(currentWidth >= maxWidth)) {
                    element.scrollBy({
                        top: 0,
                        left: step,
                        behavior: 'smooth'
                    });
                } else {
                    element.scrollTo({
                        top: 0,
                        left: -maxWidth,
                        behavior: 'smooth',
                    })
                    currentWidth = 0;
                }
                currentWidth += step;
                //console.log(currentWidth)
                //console.log('scroll')


            }, 5000)
        }
    },
    mounted() {
        this.autoScroll()

    }
}
</script>
<template>
    <section class="cards-list text-white">
        <h2 v-if="title === 'trending'" class="title">Trending</h2>
        <h2 v-else class="title">Popular</h2>
        <div class="loading" v-if="store.loading">Loading...</div>
        <div class="row mb-3 row-cols-1 row-cols-md-3 row-cols-xl-5 g-1" ref="card" v-else>
            <card-item v-for="card in list.results" :card="card"></card-item>
        </div>

    </section>
</template>

<style lang="scss" scoped>
.row {
    flex-wrap: nowrap;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;

    .col {
        scroll-snap-align: end;
        margin-bottom: 0.5rem;
    }
}
</style>