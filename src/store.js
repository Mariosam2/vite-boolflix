import { reactive } from "vue";
import axios from 'axios';
export let store = reactive({
    loading: true,
    errorMsg: '',
    API_KEY: '8223b7e6f75caa7d554c0aa366a0c2e3',
    API_URL: 'https://api.themoviedb.org/3/search/movie',
    queryString: '',
    currentMovies: null,
    callApi(url) {
        const config = {
            method: 'get',
            url: url,
            params: {
                api_key: this.API_KEY,
                query: this.queryString,
            }
        }

        axios(config)
            .then(resp => {
                this.loading = false;
                console.log((resp.data));
                this.currentMovies = resp.data.results;
                //console.log(this.store.currentMovies);
            })
            .catch(err => {
                this.loading = false;
                this.errorMsg = err.message;
                //console.log(error);
            })
    }
})