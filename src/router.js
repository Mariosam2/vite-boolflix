import { createRouter, createWebHistory } from 'vue-router';
import MoviesOrTvSeries from './views/MoviesOrTvSeriesView.vue';
import Search from './views/SearchView.vue';
import WatchList from './views/WatchListView.vue';
import NotFound from './views/NotFoundView.vue';
import Home from './views/HomeView.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/movies', name: 'movies', component: MoviesOrTvSeries },
  { path: '/tv-series', name: 'tvSeries', component: MoviesOrTvSeries },
  { path: '/search', name: 'search', component: Search },
  { path: '/watchlist', name: 'watchList', component: WatchList },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound },
];

export const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});
