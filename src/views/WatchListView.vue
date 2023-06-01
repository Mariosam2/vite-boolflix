<script>
import { store } from '../store';
import CardItem from '../components/CardItem.vue';
export default {
  name: 'WatchList',
  data() {
    return {
      store,
    };
  },
  components: {
    CardItem,
  },
  mounted() {
    setTimeout(() => {
      store.loading = false;
    }, 500);
    if (store.watchList.length === 0 && window.localStorage.getItem('watchlist')) {
      store.watchList = JSON.parse(window.localStorage.getItem('watchlist'));
      console.log(JSON.parse(window.localStorage.getItem('watchlist')));
    }
  },
};
</script>
<template>
  <main class="min-vh-100 bg_secondary" id="site_main">
    <div class="container-fluid px-3 px-md-5 py-4" v-if="store.watchList.length > 0">
      <h2 class="ms_white mb-0">My Watchlist</h2>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4">
        <card-item class="squared watchlist" v-for="result in store.watchList" :item="result.item" :movieOrTvKey="result.key" />
      </div>
    </div>
    <div class="empty-watchlist d-flex flex-column align-items-center ms_white px-3" v-else>
      <font-awesome-icon class="empty-icon" icon="fa-solid fa-circle-plus" />
      <h2 class="mb-0 pt-4 pb-3">Your watchlist is empty</h2>
      <p>Add movies and shows to your watchlist to keep track of what you want to watch</p>
      <router-link class="ms_white home-link" aria-current="page" :to="{ name: 'home' }">Back to Home</router-link>
    </div>
  </main>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;
main {
  padding-top: 5rem;

  .empty-watchlist {
    text-align: center;
    width: 100%;
    max-width: 320px;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;

    @media screen and (min-width: 586px) {
      max-width: 400px;
    }
    .empty-icon {
      width: 180px;
      height: auto;
    }

    .home-link {
      padding: 0.5rem 0.75rem;
      border: 1px solid $almost-white;
      transition: background-color 0.25s linear;
      &:hover {
        color: $almost-white;
        background-color: rgba($almost-white, 0.3);
      }
    }
  }
}
</style>
