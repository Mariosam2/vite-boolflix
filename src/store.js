import { reactive } from "vue";
import axios from 'axios';
export let store = reactive({
    leftBound: true,
    rightBound: false,
    activeMoviesPage: 1,
    activeShowsPage: 1,
    loading: true,
    errorMsg: '',
    API_KEY: '8223b7e6f75caa7d554c0aa366a0c2e3',
    API_URL: 'https://api.themoviedb.org/3/',
    currentQuery: '',
    queryString: '',
    results: {
        movies: null,
        shows: null,
    },
    // ho reimplementato la chiamata perchè mi torna più comoda nell'organizzazione delle richieste (per prendere i film e le serie tv con get treding)
    searchMovies() {
        if (this.queryString !== '') {
            this.currentQuery = this.queryString;
        }
        const config = {
            method: 'get',
            url: this.API_URL + 'search/movie',
            params: {
                api_key: this.API_KEY,
                query: this.currentQuery,
                page: this.activeMoviesPage
            }
        }
        console.log(config)
        return axios.get(config);
    },
    searchTvShows() {
        if (this.queryString !== '') {
            this.currentQuery = this.queryString;
        }
        const config = {
            method: 'get',
            url: this.API_URL + 'search/movie',
            params: {
                api_key: this.API_KEY,
                query: this.currentQuery,
                page: this.activeMoviesPage
            }
        }
        console.log(config)
        return axios.get(config);

    },
    callApi() {
        Promise.all([this.searchMovies(), this.searchTvShows()])
            .then((results) => {
                //console.log(results)
                this.queryString = '';
                this.loading = false;
                this.results.movies = results[0];
                this.results.shows = results[1];
            })
    }
    /* callSearchApi(key) {
        if (this.queryString !== '') {
            this.currentQuery = this.queryString;
        }

        const config = {
            method: 'get',
            url: this.API_URL + 'search/' + key,
            params: {
                api_key: this.API_KEY,
                query: this.currentQuery,
                page: key === 'movie' ? this.activeMoviesPage : this.activeShowsPage
            }
        }

        axios(config)
            .then(resp => {
                //console.log((resp.data));
                if (key === 'movie') {
                    this.results.movies = resp.data;
                    //console.log(resp.data)
                    //console.log(resp.data.results)
                    //console.log(this.currentMovies)
                } else {
                    this.results.shows = resp.data;
                    //console.log(resp.data.results)
                    //console.log(this.currentShows)
                }
                this.queryString = '';
                this.loading = false;


            })
            .catch(err => {
                this.loading = false;
                this.errorMsg = err.message;
                //console.log(error);
            })
    } */
})