<script>
export default {
    name: 'ShowItem',
    props: {
        show: Object,
    }

}
</script>

<template>
    <div class="col show">
        <div class="content">
            <div class="show-name">{{ show.name }}</div>
            <div class="original-name">{{ show.original_name }}</div>
            <div class="language">
                <img v-if="show.original_language == 'en'" src="../assets/img/us.png" alt="us" />
                <img v-else-if="show.original_language == 'es'" src="../assets/img/es.png" alt="us" />
                <img v-else-if="show.original_language == 'ja'" src="../assets/img/jp.png" alt="us" />
                <div class="fw-bold text-uppercase" v-else>{{ show.original_language }}</div>
            </div>
            <div class="vote-count">{{ show.vote_average }}</div>
        </div>
    </div>
</template>