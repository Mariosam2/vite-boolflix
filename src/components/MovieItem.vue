<script>
export default {
    name: 'MovieItem',
    props: {
        movie: Object,
    }


}
</script>

<template>
    <div class="col movie">
        <img class="img-fluid cover" :src="'https://image.tmdb.org/t/p/w780/' + movie.backdrop_path" alt="" />
        <div class="content ">
            <div class="movie-title">{{ movie.title }}</div>
            <div class="original-title">{{ movie.original_title }}</div>
            <div class="language">
                <img v-if="movie.original_language == 'en'" src="../assets/img/us.png" alt="us" />
                <img v-else-if="movie.original_language == 'es'" src="../assets/img/es.png" alt="us" />
                <img v-else-if="movie.original_language == 'ja'" src="../assets/img/jp.png" alt="us" />
                <div class="fw-bold text-uppercase" v-else>{{ movie.original_language }}</div>
            </div>
            <div class="vote-count">{{ movie.vote_average }}</div>
        </div>
    </div>
</template>


