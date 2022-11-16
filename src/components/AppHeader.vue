<script>
import { store } from '../store.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
library.add(faUserSecret)
export default {
    name: 'AppHeader',
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            store,
        }
    },
    methods: {
        getCurrentMovies() {
            this.store.callApi(this.store.API_URL);
        }
    }
}
</script>

<template>
    <header id="site_header">
        <div class="container d-flex justify-content-between align-items-center">
            <h1 class="text-uppercase">Boolflix</h1>
            <div class="search d-flex align-items-center">
                <input type="search" name="searchBar" id="searchBar" class="form-control" v-model="store.queryString"
                    @keyup.enter="getCurrentMovies">
                <button type="submit" class="btn btn-primary" @click="getCurrentMovies">
                    <font-awesome-icon icon="fa-solid fa-user-secret"></font-awesome-icon>
                </button>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.search {
    height: 30px;
    margin: 1rem;
}
</style>