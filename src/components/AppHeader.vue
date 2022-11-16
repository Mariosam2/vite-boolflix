<script>
import { store } from '../store.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
library.add(faMagnifyingGlass)
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
        getCurrentMoviesAndShows() {
            if (this.store.queryString !== '') {
                this.store.callApi('movie');
                this.store.callApi('tv');


            }

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
                    @keyup.enter="getCurrentMoviesAndShows">
                <button type="submit" class="btn btn-primary" @click="getCurrentMoviesAndShows">
                    <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
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