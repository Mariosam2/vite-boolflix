<script>
export default {
    name: 'CardItem',
    props: {
        card: Object,
    }


}
</script>

<template>
    <div class="col ms_card">
        <img v-if="card.backdrop_path !== null" class="img-fluid cover"
            :src="'https://image.tmdb.org/t/p/w780/' + card.backdrop_path" alt="" />
        <div class="content" :class="card.backdrop_path === null ? 'show' : ''">
            <div class="card-title">{{ card.title || card.name }}</div>
            <div class="original-title">{{ card.original_title || card.original_name }}</div>
            <div class="language">
                <img v-if="card.original_language == 'en'" src="../assets/img/us.png" alt="us" />
                <img v-else-if="card.original_language == 'es'" src="../assets/img/es.png" alt="us" />
                <img v-else-if="card.original_language == 'ja'" src="../assets/img/jp.png" alt="us" />
                <div class="fw-bold text-uppercase" v-else>{{ card.original_language }}</div>
            </div>
            <div class="vote-count">{{ card.vote_average }}</div>
        </div>
    </div>
</template>


