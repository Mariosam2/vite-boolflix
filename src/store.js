import { reactive } from 'vue';
import { router } from './router';
import axios from 'axios';
export let store = reactive({
  languages: ['en', 'es', 'ja'],
  currentMoviesPage: 1,
  currentTvSeriesPage: 1,
  loading: true,
  moviesLoading: false,
  tvSeriesLoading: false,
  searchedMoviesTotalPages: 0,
  searchedMoviesTotalResults: 0,
  searchedTvSeriesTotalPages: 0,
  searchedTvSeriesTotalResults: 0,
  errorMsg: '',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  YOUTUBE_API_KEY: import.meta.env.VITE_YT_API_KEY,
  ORIGINAL_IMAGE_API_URL: 'https://image.tmdb.org/t/p/original',
  SMALLER_IMAGE_API_URL: 'https://image.tmdb.org/t/p/w780',
  LOGO_IMAGE_API_URL: 'https://image.tmdb.org/t/p/w185',
  API_URL: 'https://api.themoviedb.org/3',
  YOUTUBE_API_URL: 'https://www.googleapis.com/youtube/v3/videos',
  queryString: '',
  homeResults: false,
  results: {
    trending: null,
    popular: null,
  },
  searchedResults: {
    movies: null,
    tv: null,
  },
  watchList: [],
  movie: {
    trendingTopTen: [],
  },
  tv: {
    trendingTopTen: [],
  },
  trendingResult: null,
  trendingResultIndex: null,
  trendingDetails: null,
  trendingLogo: null,
  infosVisible: false,
  trailer: null,
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  getStaticImage(imageName) {
    return new URL(`/src/assets/img/${imageName}`, import.meta.url).href;
  },
  async mountInfos(id, key) {
    try {
      //console.log(this);
      const resp = await axios.get(`${this.API_URL}/${key}/${id}/videos?api_key=${this.API_KEY}`);
      let isRestricted = true;
      let filteredVideo = null;
      //Checkin for youtube age and region restrictions on the trailer, if it's restriced keep searching for a trailer which is not restricted by age limit
      while (isRestricted) {
        filteredVideo = resp.data.results.find((video) => video.type === 'Trailer' && video.official && video.iso_639_1 === 'en');
        if (filteredVideo !== null && filteredVideo !== undefined) {
          const youtubeResponse = await axios.get(this.YOUTUBE_API_URL + '?videoSyndicated=true', {
            params: {
              part: 'contentDetails,status',
              id: filteredVideo.key,
              key: this.YOUTUBE_API_KEY,
            },
          });
          const embeddable = youtubeResponse.data.items[0].status.embeddable;
          //console.log(embeddable);
          if (embeddable) {
            //console.log(youtubeResponse);

            //Getting the region restrictions by youtube v3 api
            const regionRestriction = youtubeResponse.data.items[0].contentDetails?.regionRestriction?.allowed;

            //Getting the age restriction by youtube v3 api
            const ageRestriction = youtubeResponse.data.items[0].contentDetails?.contentRating?.ytRating;
            //console.log(restriction, youtubeResponse)
            if (ageRestriction) {
              //Keep searching for a trailer removing the restricted one
              //console.log('restricted', ageRestriction);
              resp.data.results.splice(resp.data.results.indexOf(filteredVideo), 1);
            } else if (regionRestriction && regionRestriction.length > 0) {
              if (regionRestriction.includes('IT') && regionRestriction.includes('CH')) {
                //Not region restricted trailer
                //console.log('not restricted');
                isRestricted = false;
              } else {
                //Keep searching for a trailer removing the restricted one
                resp.data.results.splice(resp.data.results.indexOf(filteredVideo), 1);
              }
            } else {
              //Not restricted trailer or not a valid trailer found
              //console.log('not restricted');
              isRestricted = false;
            }
          } else {
            resp.data.results.splice(resp.data.results.indexOf(filteredVideo), 1);
          }
        } else {
          isRestricted = false;
        }
      }

      if (filteredVideo !== null && filteredVideo !== undefined) {
        //console.log(this.trailer);
        this.trailer = filteredVideo;
        window.onYouTubeIframeAPIReady(this.trailer);
      }
      store.infosVisible = true;
      document.body.classList.add('noscroll');
      const cardInfo = document.getElementById(`card-info-${id}`);
      //console.log(cardInfo);
      cardInfo.classList.add('visible');
    } catch (err) {
      //console.log(err.message);
    }
  },
  getTrending(key) {
    const config = {
      method: 'get',
      url: this.API_URL + `/trending/${key}/day`,
      params: {
        api_key: this.API_KEY,
        append_to_response: 'images',
      },
    };
    return axios(config);
  },
  getPopular(key) {
    const config = {
      method: 'get',
      url: this.API_URL + `/${key}/popular`,
      params: {
        api_key: this.API_KEY,
        append_to_response: 'images',
      },
    };
    return axios(config);
  },
  async getTrendingTopTen(key) {
    try {
      const response = await this.getTrending(key);
      //An item must have to image to be displayed in the page
      this[key].trendingTopTen = response.data.results.filter((item, index) => index < 10 && item.poster_path !== null).map((item) => item.id);
      console.log('trending top ten');
    } catch (err) {
      console.log(err.message);
    }
  },

  async getTrendigAndPopular(key) {
    try {
      console.log('trending popular');
      //Getting trending and popular movies
      const response = await Promise.all([this.getTrending(key), this.getPopular(key)]);
      const randomIndex = Math.floor(Math.random() * 10);
      //this.shuffle(response[0].data.results)
      //An item must have to image to be displayed in the page
      const filteredTrending = response[0].data.results.filter((item) => item.poster_path !== null);
      const filteredPopular = response[1].data.results.filter((item) => item.poster_path !== null);
      this.trendingResult = filteredTrending[randomIndex];
      this.trendingResultIndex = randomIndex;
      this.results.trending = this.shuffle(filteredTrending);
      this.results.popular = filteredPopular;

      //Getting trending details and logo
      this.trendingDetails = await axios.get(this.API_URL + `/${key}/${this.trendingResult.id}?api_key=${this.API_KEY}&append_to_response=images`);
      this.trendingLogo = this.trendingDetails.data?.images?.logos.find((logo) => logo.iso_639_1 === 'en')?.file_path;
      this.homeResults = true;
      if (!this.trendingLogo) {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    } catch (err) {
      router.push({ name: 'notFound' });
    }
  },

  async searchResults(key, page) {
    const searchedResults = await axios.get(this.API_URL + `/search/${key}`, {
      params: {
        api_key: store.API_KEY,
        page: page,
        include_adult: false,
        query: store.queryString,
      },
    });
    return searchedResults;
  },
  getUpcomingMovies() {
    const config = {
      method: 'get',
      url: this.API_URL + '/movie/upcoming',
      params: {
        api_key: this.API_KEY,
        region: 'US',
      },
    };
    return axios(config);
  },
  getTopRatedMovies() {
    const config = {
      method: 'get',
      url: this.API_URL + '/movie/top_rated',
      params: {
        api_key: this.API_KEY,
      },
    };
    return axios(config);
  },
});
