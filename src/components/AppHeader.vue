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
                this.store.callSearchApi('movie');
                this.store.callSearchApi('tv');


            }

        }
    }
}
</script>

<template>
    <header id="site_header" class="my-4">
        <div class="container-xl px-5 px-md-3 px-xl-0 d-flex justify-content-between align-items-center">
            <div class="logo"><img class="img-fluid"
                    src="https://image.tmdb.org/t/p/w342/wwemzKWzjKYJFfCeiB57q3r4Bcm.png" alt="logo" /></div>

            <div class="search d-flex align-items-center">
                <input type="search" name="searchBar" id="searchBar" class="form-control rounded-0"
                    v-model="store.queryString" @keyup.enter="getCurrentMoviesAndShows">
                <button type="submit" class="btn" @click="getCurrentMoviesAndShows">
                    <font-awesome-icon class="ms_icon mx-2" icon="fa-solid fa-magnifying-glass" />
                </button>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

.logo {
    width: 100px;
}

.search {
    height: 30px;
    margin: 1rem;

    input:focus {
        box-shadow: none;
        border: none;
    }

    .ms_icon {
        color: $almost-white;
    }

}
</style>