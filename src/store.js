import { reactive } from "vue";
import axios from 'axios';
export let store = reactive({
    loading: true,
    errorMsg: '',
    API_KEY: '8223b7e6f75caa7d554c0aa366a0c2e3',
    API_URL: 'https://api.themoviedb.org/3/search/',
    queryString: '',
    currentMovies: null,
    currentShows: null,
    callApi(key) {
        const config = {
            method: 'get',
            url: this.API_URL + key,
            params: {
                api_key: this.API_KEY,
                query: this.queryString,
            }
        }

        axios(config)
            .then(resp => {
                this.loading = false;
                //console.log((resp.data));
                if (key === 'movie') {
                    this.currentMovies = resp.data.results;
                    //console.log(resp.data.results)
                    //console.log(this.currentMovies)
                } else {
                    this.currentShows = resp.data.results;
                    //console.log(resp.data.results)
                    //console.log(this.currentShows)
                }


            })
            .catch(err => {
                this.loading = false;
                this.errorMsg = err.message;
                //console.log(error);
            })
    }
})