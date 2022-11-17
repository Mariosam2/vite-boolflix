<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
library.add(faStar)
export default {
    name: 'CardItem',
    components: {
        FontAwesomeIcon
    },
    props: {
        card: Object,
    },
    data() {
        return {
            votes: 5,
        }
    },
    methods: {
        getValutation(num) {
            let valutation = Math.ceil(num / 2);
            return valutation
        }
    },


}
</script>

<template>
    <div class="col">
        <div class="ms_card">
            <img v-if="card.backdrop_path !== null" class="img-fluid cover"
                :src="'https://image.tmdb.org/t/p/w780/' + card.backdrop_path" alt="" />
            <div class="content" :class="card.backdrop_path === null ? 'show' : ''">
                <div class="card-title">{{ card.title || card.name }}</div>
                <div class="card-title">{{ card.original_title || card.original_name }}</div>
                <div class="language">
                    <img v-if="card.original_language == 'en'" src="../assets/img/us.png" alt="us" />
                    <img v-else-if="card.original_language == 'es'" src="../assets/img/es.png" alt="us" />
                    <img v-else-if="card.original_language == 'ja'" src="../assets/img/jp.png" alt="us" />
                    <div class="fw-bold text-uppercase" v-else>{{ card.original_language }}</div>
                </div>
                <div class="vote-count">
                    <font-awesome-icon :class="i < getValutation(card.vote_average) ? 'fill' : ''"
                        icon="fa-solid fa-star" v-for="i in votes" />
                </div>
                <small class="overview ms_small">{{ card.overview }}</small>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

.card-title {
    font-weight: bold;

}

.vote-count {
    .fill {
        color: yellow;
    }
}

.ms_small {
    font-size: smaller;
}
</style>


