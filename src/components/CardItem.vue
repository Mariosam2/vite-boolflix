<script>
import { store } from '../store.js'
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
            store,
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
            <img v-if="card.poster_path !== null" class="img-fluid cover"
                :src="'https://image.tmdb.org/t/p/w780/' + card.poster_path" alt="" />
            <div class="content" :class="card.poster_path === null ? 'show' : ''">
                <div class="card-title">{{ card.title || card.name }}</div>
                <div class="card-title">{{ card.original_title || card.original_name }}</div>
                <div class="language">
                    <img v-if="store.languages.includes(card.original_language)"
                        :src="`../src/assets/img/${card.original_language}.png`" :alt="`${card.original_language}`" />
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


