<script>
import { store } from '../store.js';
export default {
  name: 'AppHeader',
  data() {
    return {
      store,
      scrollY: 0,
      loading: false,
      currentQuery: '',
      isSearchBarOpen: false,
      isOpen: false,
      offCanvasNav: false,
    };
  },
  methods: {
    async search(event) {
      if (!this.isSearchBarOpen) {
        this.openSearchbar();
        return;
      } else if (this.currentQuery.replace('^\s*$').length !== 0 || !event) {
        if (event || (this.$route.name !== 'search' && this.$route.name !== 'notFound')) {
          store.loading = true;
          store.queryString = this.currentQuery;
          if (event) {
            store.currentMoviesPage = 1;
            store.currentTvSeriesPage = 1;
          }
        }

        console.log('call');
        Promise.all([store.searchResults('movie', store.currentMoviesPage), store.searchResults('tv', store.currentTvSeriesPage)])
          .then((resp) => {
            //Taking the first 8 elements with a poster image sorted by popularity
            window.localStorage.setItem('queryString', store.queryString);
            store.searchedResults.movies = resp[0]?.data.results
              .filter((result) => result.poster_path !== null)
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 8);

            store.searchedResults.tv = resp[1]?.data.results
              .filter((result) => result.poster_path !== null)
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 8);

            console.log(store.searchedResults);
            window.localStorage.setItem('searchedResults', JSON.stringify({ movies: store.searchedResults.movies, tv: store.searchedResults.tv }));

            store.searchedMoviesTotalPages = resp[0]?.data.total_pages;
            store.searchedTvSeriesTotalPages = resp[1]?.data.total_pages;
            /* console.log(resp[0].data, resp[1].data); */
            window.localStorage.setItem('currentPages', JSON.stringify({ movies: store.currentMoviesPage, tv: store.currentTvSeriesPage }));
            window.localStorage.setItem('totalPages', JSON.stringify({ movies: store.searchedMoviesTotalPages, tv: store.searchedTvSeriesTotalPages }));
            this.offCanvasNav = false;
            setTimeout(() => {
              this.emptySearchBar();
              //console.log(this.$route.name);
              if (this.$route.name !== 'search') {
                this.$router.push({ name: 'search' });
              }

              store.loading = false;

              store.moviesLoading = false;
              store.tvSeriesLoading = false;
              if (store.searchedResults.movies.length === 0 && store.searchedResults.tv.length === 0) {
                console.log('vuoto');
                this.$router.push({ name: 'notFound' });
                return;
              }
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            setTimeout(() => {
              this.emptySearchBar();
              //console.log(this.$route.name);
              if (this.$route.name !== 'notFound') {
                this.$router.push({ name: 'notFound' });
              }

              store.loading = false;

              store.moviesLoading = false;
              store.tvSeriesLoading = false;
            }, 500);
          });
      }
    },
    openSearchbar() {
      const searchbar = document.getElementById('searchbar');
      this.isSearchBarOpen = true;
      searchbar.focus();
    },
    closeSearchBar() {
      this.isSearchBarOpen = false;
    },
    emptySearchBar() {
      const searchbar = document.getElementById('searchbar');
      this.currentQuery = '';
      searchbar.focus();
    },
    toggleNav() {
      this.offCanvasNav = !this.offCanvasNav;
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    currentMoviesPage() {
      return store.currentMoviesPage;
    },
    currentTvSeriesPage() {
      return store.currentTvSeriesPage;
    },
    queryString: {
      get() {
        return this.currentQuery;
      },
      set(newValue) {
        this.currentQuery = newValue;
      },
    },
  },
  created() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY || window.pageYOffset;
    });
  },
  mounted() {
    console.log(window.localStorage?.getItem('queryString'));
    if (window.localStorage?.getItem('queryString')) {
      store.queryString = localStorage.getItem('queryString');
    }
  },
  watch: {
    $route(newValue) {
      //console.log(newValue);
      if (newValue.name !== 'search' && newValue.name !== 'notFound') {
        this.closeSearchBar();
      }
      this.offCanvasNav = false;
      store.loading = true;
    },
    currentMoviesPage() {
      if (!store.loading) {
        store.moviesLoading = true;
      }
      this.search();
    },
    currentTvSeriesPage() {
      if (!store.loading) {
        store.tvSeriesLoading = true;
      }

      this.search();
    },
  },
};
</script>

<template>
  <header id="site_header" class="py-2 w-100">
    <div class="background" :class="this.scrollY > 0 ? '' : 'opacity-0'"></div>
    <div class="container-fluid desktop-nav px-3 px-lg-5 justify-content-between align-items-center">
      <div class="logo d-none d-lg-block">
        <router-link aria-current="page" :to="{ name: 'home' }">
          <img class="img-fluid" :src="store.getStaticImage('boolflix-logo.png')" alt="logo" />
        </router-link>
      </div>
      <nav class="navbar me-auto ps-lg-4">
        <router-link class="nav-link fw-semibold mx-3" :class="currentRouteName === 'home' ? 'active' : ''" aria-current="page" :to="{ name: 'home' }">Home</router-link>
        <router-link class="nav-link fw-semibold mx-3" :class="currentRouteName === 'movies' ? 'active' : ''" aria-current="page" :to="{ name: 'movies' }">Movies</router-link>
        <router-link class="nav-link fw-semibold mx-3" :class="currentRouteName === 'tvSeries' ? 'active' : ''" aria-current="page" :to="{ name: 'tvSeries' }">Tv Series</router-link>
        <router-link class="nav-link fw-semibold mx-3" :class="currentRouteName === 'watchList' ? 'active' : ''" aria-current="page" :to="{ name: 'watchList' }">Watchlist</router-link>
      </nav>
      <div class="search d-flex align-items-center" :class="isSearchBarOpen ? 'open' : ''">
        <font-awesome-icon class="prova-icon invisible" icon="fa-solid fa-magnifying-glass" />
        <font-awesome-icon class="search-icon" @click="search($event)" icon="fa-solid fa-magnifying-glass" />
        <font-awesome-icon v-if="isSearchBarOpen" @click="closeSearchBar()" class="close-icon" icon="fa-solid fa-xmark" />
        <div class="field position-relative">
          <input type="text" id="searchbar" placeholder="Search..." @keyup.enter="search($event)" autocomplete="off" v-model="queryString" />
          <font-awesome-icon v-if="currentQuery.length > 0 && isSearchBarOpen" @click="emptySearchBar()" class="clear-icon" icon="fa-solid fa-xmark" />
        </div>
      </div>
    </div>
    <div class="container-fluid burger-container">
      <div class="heading d-flex align-items-center">
        <div class="logo">
          <router-link aria-current="page" :to="{ name: 'home' }">
            <img class="img-fluid" :src="store.getStaticImage('boolflix-logo.png')" alt="logo" />
          </router-link>
        </div>
        <div class="burger" :class="offCanvasNav ? 'open' : ''" @click="toggleNav()">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="off-canvas-nav" :class="offCanvasNav ? 'open' : ''">
      <div class="container-fluid">
        <div class="heading d-flex align-items-center py-2">
          <div class="logo invisible"><img class="img-fluid" :src="store.getStaticImage('boolflix-logo.png')" alt="logo" /></div>
          <div class="burger invisible">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </div>
        <nav class="navbar me-auto d-flex flex-column align-items-start py-0">
          <router-link class="nav-link fw-semibold ms-2 my-3" :class="currentRouteName === 'home' ? 'active' : ''" aria-current="page" :to="{ name: 'home' }">Home</router-link>
          <router-link class="nav-link fw-semibold ms-2 my-3" :class="currentRouteName === 'movies' ? 'active' : ''" aria-current="page" :to="{ name: 'movies' }">Movies</router-link>
          <router-link class="nav-link fw-semibold ms-2 my-3" :class="currentRouteName === 'tvSeries' ? 'active' : ''" aria-current="page" :to="{ name: 'tvSeries' }">Tv Series</router-link>
          <router-link class="nav-link fw-semibold ms-2 my-3" :class="currentRouteName === 'watchList' ? 'active' : ''" aria-current="page" :to="{ name: 'watchList' }">Watchlist</router-link>
          <div class="search d-flex align-items-center ms-2" :class="isSearchBarOpen ? 'open' : ''">
            <font-awesome-icon class="prova-icon invisible" icon="fa-solid fa-magnifying-glass" />
            <font-awesome-icon class="search-icon" @click="search($event)" icon="fa-solid fa-magnifying-glass" />
            <font-awesome-icon v-if="isSearchBarOpen" @click="closeSearchBar()" class="close-icon" icon="fa-solid fa-xmark" />
            <div class="field position-relative">
              <input type="text" id="searchbar" placeholder="Search..." @keyup.enter="search($event)" autocomplete="off" v-model="queryString" />
              <font-awesome-icon v-if="currentQuery.length > 0 && isSearchBarOpen" @click="emptySearchBar()" class="clear-icon" icon="fa-solid fa-xmark" />
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

#site_header {
  position: absolute;
  @media screen and (min-width: 660px) {
    position: fixed;
  }

  top: 0;
  z-index: 4;
  .container-fluid.desktop-nav {
    display: none;
    transition: all 0.25s ease;
    @media screen and (min-width: 660px) {
      display: flex;
    }
  }
}

#site_header .background {
  transition: opacity 0.25s ease;
  z-index: -1;
  display: none;
  @media screen and (min-width: 660px) {
    display: block;
  }
}

#site_header .background {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, black, $secondary);
  opacity: 1;
}

.logo {
  width: 120px;
  height: auto;
  z-index: 6;
}

.navbar {
  .nav-link {
    position: relative;
    @media screen and (max-width: 587px) {
      font-size: 1.1rem;
    }
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;
    border-bottom: 1px solid transparent;
    transform: scaleX(0);
    transition: transform 0.25s ease;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;
    border-bottom: 1px solid white;
    transform: scaleX(1);
    transition: transform 0.25s ease;
  }

  .nav-link.active {
    color: white;
  }
  a {
    color: $almost-white;
    text-decoration: none;

    &:hover {
      color: white;
      cursor: pointer;
    }
  }
}
.input-group.search-group {
  height: 40px;
  width: 40px;
  position: relative;
}

.clear-icon {
  position: absolute;
  z-index: 10;
  color: $almost-white;
  top: 50%;
  width: 12px;
  height: 12px;
  right: 42px;
  translate: 0 -50%;
  &:hover {
    cursor: pointer;
  }
}

.close-icon {
  position: absolute;
}

.search-icon,
.close-icon,
.prova-icon {
  color: $almost-white;
  width: 20px;
  cursor: pointer;
  height: 20px;
  padding: 0.5rem;
  transition: all 0.3s ease;
  z-index: 10;
}

.prova-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 0;
  top: 50%;
  translate: 0 -50%;
}

.search {
  border: 1px solid $almost-white;
  backdrop-filter: blur(10px);
  position: relative;
  transition: all 0.25s cubic-bezier(0.51, 0.92, 0.24, 1.15);
  .field {
    position: relative;
    width: 0;
    transition: all 0.25s cubic-bezier(0.51, 0.92, 0.24, 1.15);
    input {
      color: $almost-white;
      padding: 0.5rem;
      padding-right: 60px;
      border: 0;
      display: block;
      position: absolute;
      background-color: transparent;
      top: 50%;
      translate: 0 -50%;
      width: 100%;
      display: none;
      margin: 0;
      line-height: 1;
      transition: opacity 0.5s ease;
      &:focus {
        outline: none;
      }

      &::-webkit-input-placeholder {
        color: $almost-white;
      }

      &::-moz-placeholder {
        opacity: 1;
        color: $almost-white;
      }

      &:-ms-input-placeholder {
        color: $almost-white;
      }
    }
  }
}

.search.open {
  transition: all 0.25s cubic-bezier(0.51, 0.92, 0.24, 1.15);

  .field {
    width: 200px;
    input {
      display: block;
    }
  }
}

.burger-container {
  display: block;
  @media screen and (min-width: 660px) {
    display: none;
  }
}

.burger {
  position: relative;
  width: 28px;
  margin-left: auto;
  z-index: 6;
}

.burger .line {
  width: 100%;
  height: 4px;
  background-color: $almost-white;
  border-radius: 28px;
  transition: all 0.25s ease;
}

.burger .line:nth-child(2) {
  margin-block: 0.3em;
  left: 0;
}

.burger.open .line:first-child,
.burger.open .line:nth-child(3) {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}

.burger.open .line:first-child {
  rotate: 45deg;
}
.burger.open .line:nth-child(2) {
  position: relative;
  opacity: 0;
  left: -28px;
}
.burger.open .line:nth-child(3) {
  rotate: -45deg;
}

.off-canvas-nav {
  visibility: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  transform: scaleX(0);
  transform-origin: right;
  transition: all 0.25s ease;
  @media screen and (min-width: 660px) {
    display: none;
  }
  > * {
    transition: opacity 0.1s easee;
    opacity: 0;
  }
}

.off-canvas-nav.open {
  visibility: visible;
  transform: scaleX(1);
  background-color: black;
  > * {
    opacity: 1;
  }
}
</style>
