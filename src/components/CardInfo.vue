<script>
import axios from 'axios';
import { store } from '../store';
import KeenSlider from 'keen-slider';
import { reactive } from 'vue';
export default {
  name: 'CardInfo',
  props: {
    item: Object,
    trailer: Object,
    movieOrTvKey: String,
  },
  emits: ['closePopup'],
  data() {
    return {
      store,
      director: null,
      production: null,
      cast: null,
      player: null,
      backdropImages: null,
      backdropImagesLength: 0,
      isPlayerReady: false,
      hasVideoEnded: false,
      mutedVolume: 0,
      playerVolume: 0,
      isMuted: true,
      votes: 5,
      certification: NaN,
      duration: null,
      logo: null,
      dateOptions: { year: 'numeric', day: 'numeric', month: 'long' },
      popUpAnimationDuration: 350,
      slider: null,
      current: 0,
      isInWatchList: false,
    };
  },
  methods: {
    prova() {
      console.log('splide mounted');
    },
    initYoutube(movieId, itemId) {
      if (this.player !== null) {
        this.player.destroy();
      }
      //console.log(`player-${itemId}`);
      try {
        this.player = new YT.Player(`player-${itemId}`, {
          width: '100%',
          height: '100%',
          videoId: movieId,
          host: 'http://www.youtube-nocookie.com',
          playerVars: { autoplay: 1, mute: 1, controls: 1, rel: 0, disablekb: 1, modestbranding: 1 },
          events: {
            onReady: this.onPlayerReady,
            onStateChange: this.onPlayerStateChange,
          },
        });
        this.playerVolume = 0;
      } catch (err) {
        console.log(err);
      }
    },
    onPlayerReady() {
      //console.log("Player ready");
      //console.log(this.player, this.player.getPlayerState());
      this.hasVideoEnded = false;
      this.isPlayerReady = true;

      //Not sure about this, I saw that some videos are not "autoplayable"
      //It's just to make sure the video is starting
      //state 1 means "playing"
      if (this.player.getPlayerState() !== 1) {
        this.player.playVideo();
      }
    },
    onPlayerStateChange() {
      // console.log("Player state changed", this.player.getPlayerState());

      if (this.player.getPlayerState() === 0) {
        //state 0 means "ended"
        this.player.destroy();
        this.isPlayerReady = false;
        //console.log(this.isPlayerReady)
        this.hasVideoEnded = true;
      }
    },
    switchMute() {
      if (this.player.isMuted()) {
        this.player.unMute();
        this.playerVolume = parseInt(this.mutedVolume) === 0 ? 25 : this.mutedVolume;
        this.player.setVolume(this.playerVolume);
        //console.log('unmuted');
        this.isMuted = false;
      } else if (parseInt(this.playerVolume) !== 0) {
        this.player.mute();
        this.mutedVolume = this.playerVolume;
        this.playerVolume = 0;
        //console.log('muted');
        this.isMuted = true;
      }
    },
    play() {
      window.onYouTubeIframeAPIReady(this.trailer);
    },

    setVolume(event) {
      this.player.setVolume(event.target.value);
      if (parseInt(event.target.value) !== 0) {
        this.player.unMute();
        this.isMuted = false;
      } else if (parseInt(event.target.value) === 0) {
        this.player.mute();
        this.isMuted = true;
      }
    },
    closeInfos(id) {
      const cardInfo = document.querySelectorAll(`#card-info-${id}`);
      cardInfo.forEach((card) => {
        card.classList.remove('visible');
      });
      //console.log(cardInfo)
      document.body.classList.remove('noscroll');
      //console.log(cardInfo)
      store.infosVisible = false;
      if (this.player !== null) {
        this.player.destroy();
        this.isPlayerReady = false;
        //console.log(this.isPlayerReady)
      }
      setTimeout(() => {
        this.$emit('closePopup', false);

        store.trailer = null;
      }, this.popUpAnimationDuration);

      //console.log(this.player);
    },
    getValutation(num) {
      let valutation = Math.ceil(num / 2);
      return valutation;
    },
    getItemDetails() {
      axios
        .get(`${store.API_URL}/${this.movieOrTvKey}/${this.item.id}?api_key=${store.API_KEY}&append_to_response=release_dates,images,credits`)
        .then((resp) => {
          //get the certification of the film
          //console.log(resp);
          if (resp.data?.release_dates) {
            for (const result of resp.data.release_dates.results) {
              let certification = this.certification;
              if (result.release_dates && result.release_dates.length > 0) {
                certification = parseInt(result.release_dates[0].certification);
              }
              if (!isNaN(certification) && certification > 0) {
                //console.log(resp.data.images.logos[0])
                //console.log(certification);
                this.certification = certification;
                break;
              }
            }
          }
          //get other infos like duration, backdrops ecc...
          if (this.movieOrTvKey === 'tv') {
            this.duration = resp.data?.episode_run_time;
          } else {
            this.duration = resp.data?.runtime;
          }

          //console.log(resp.data.images.logos);
          this.logo = resp.data?.images?.logos.find((logo) => logo.iso_639_1 === 'en')?.file_path;
          this.director = resp.data?.credits?.crew.find((crewEl) => crewEl.job === 'Director');
          this.production = resp.data?.credits?.crew.filter((crewEl) => crewEl.department === 'Production');
          this.cast = resp.data?.credits?.cast;
          this.backdropImages = resp.data?.images?.backdrops.filter((image) => {
            if (image.iso_639_1 === 'en' && this.backdropImagesLength < 5) {
              this.backdropImagesLength++;
              return true;
            }
          });

          //console.log(resp.data.id);
          this.$nextTick(() => {
            if (this.backdropImagesLength > 0) {
              this.slider = new KeenSlider(this.$refs[`card-info-slider-${this.item.id}`], {
                slideChanged: (slider) => {
                  this.current = slider.track.details.rel;
                },
                loop: true,
                mode: 'snap',
                renderMode: 'performance',
                dragSpeed: 1,
                slides: {
                  perView: 1,
                  spacing: 15,
                },
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toggleWatchList(item, key) {
      //onsole.log(store.watchList);
      if (!this.isInWatchList) {
        store.watchList.push({ item: reactive(item), key: key });
      } else {
        const watchListItems = store.watchList.map((result) => result.item.id);
        const itemIndex = watchListItems.indexOf(item.id);
        console.log(itemIndex);
        store.watchList.splice(itemIndex, 1);
      }
      console.log(item);
      console.log(store.watchList);
      //console.log(store.watchList, JSON.parse(window.localStorage.getItem('watchlist')));
      this.isInWatchList = !this.isInWatchList;

      //console.log(store.watchList);
    },
  },
  computed: {
    dotHelper() {
      return this.slider ? [...Array(this.slider.track.details.slides.length).keys()] : [];
    },
  },
  beforeMount() {
    window.onYouTubeIframeAPIReady = (trailer) => {
      //console.log('onYouTubeIframeAPIReady');
      if (trailer !== null && trailer !== undefined) {
        //waiting for popup aniamtion before initializing the player
        setTimeout(() => {
          this.initYoutube(trailer.key, this.item.id);
        }, 500);
      }
    };
    this.getItemDetails();
  },
  mounted() {
    if (window.localStorage.getItem('watchlist')) {
      const localStorageWatchList = JSON.parse(window.localStorage.getItem('watchlist'));
      store.watchList = localStorageWatchList;
    }
    if (this.item) {
      if (store.watchList.map((result) => result.item.id).includes(this.item.id)) {
        this.isInWatchList = true;
      }
    }
  },
};
</script>
<template>
  <!--  -->
  <Teleport to="#item-popup">
    <div v-if="store.infosVisible" class="outer-layover" @click="closeInfos(item.id)"></div>
    <div class="ms_white" :class="item.backdrop_path || this.trailer ? 'h-600' : 'h-content'" v-if="item !== null && item !== undefined" :id="'card-info-' + item.id">
      <div class="card preview-card border-0 rounded-0" :class="item.backdrop_path || this.trailer ? 'gradient' : 'full p-3 pt-4'">
        <div v-if="item.backdrop_path || this.trailer" class="preview">
          <font-awesome-icon @click="closeInfos(item.id)" class="close-icon m-2 p-1" icon="fa-solid fa-xmark" />
          <div class="layover"></div>
          <img class="preview-img" :src="store.SMALLER_IMAGE_API_URL + item.backdrop_path" alt="" />
          <div class="video">
            <div :id="'player-' + item.id"></div>
          </div>
          <div class="item-logo p-3">
            <img v-if="logo" :src="store.LOGO_IMAGE_API_URL + this.logo" alt="" />
          </div>
          <div class="controls d-flex align-items-center justify-content-end p-3">
            <div v-if="isPlayerReady" class="volume d-flex align-items-center">
              <div class="switch-mute" @click="switchMute()">
                <div class="volume-icon">
                  <font-awesome-icon v-if="isMuted | (parseInt(playerVolume) === 0)" icon="fa-solid fa-volume-xmark" />
                  <font-awesome-icon v-else-if="parseInt(playerVolume) < 50" icon="fa-solid fa-volume-low" />
                  <font-awesome-icon v-else icon="fa-solid fa-volume-high" />
                </div>
              </div>
              <input class="volume-slider" type="range" name="volume" id="volume" step="1" min="0" max="100" v-model="playerVolume" @input="setVolume($event)" />
            </div>
            <div v-if="hasVideoEnded" class="play" @click="play()">
              <font-awesome-icon class="rewind-icon" icon="fa-solid fa-rotate-left" />
            </div>
          </div>
        </div>

        <div class="content p-3 pb-4">
          <div class="card_top d-flex pb-3">
            <div v-if="(trailer !== null && trailer !== undefined) || this.$route.name !== 'watchList'" class="cta-buttons d-flex align-items-center pe-3">
              <a v-if="trailer !== null && trailer !== undefined" class="trailer_btn" :href="'https://www.youtube.com/watch?v=' + trailer.key" target="_blank">
                Trailer
                <font-awesome-icon class="cta-icon ms-1" icon="fa-solid fa-arrow-up-right-from-square" />
              </a>
              <div v-if="this.$route.name !== 'watchList'" @click="toggleWatchList(item, movieOrTvKey)" :class="isInWatchList ? 'in-watchlist' : ''" class="watchlist_btn d-flex align-items-center">
                <div class="plus-minus me-2"></div>
                Watchlist
              </div>
            </div>
            <div class="details d-flex align-items-center flex-grow-1">
              <span v-if="item.release_date" class="release_date me-1">
                {{ new Date(item.release_date).toLocaleDateString('en-US', dateOptions) }}
              </span>
              <span v-else-if="item.first_air_date" class="release_date me-1">
                {{ new Date(item.first_air_date).toLocaleDateString('en-US', dateOptions) }}
              </span>
              <div v-if="duration !== null && duration > 0" class="duration d-flex">
                <span class="time ms-1">{{ this.movieOrTvKey === 'tv' ? duration + 'min/ep' : duration + ' min' }}</span>
              </div>
              <div v-if="!isNaN(certification)" class="ms-auto certification d-flex">
                <span class="age">{{ certification + ' +' }}</span>
              </div>
            </div>
          </div>
          <div v-if="item.vote_average > 0" class="rating text-success fw-bold border-sucess">
            <span>
              {{ parseInt(item.vote_average * 10) + '% ' + 'positive rating' }}
            </span>
          </div>
          <h3 class="item-title pt-3">{{ item.title || item.name }}</h3>

          <small v-if="item.overview" class="d-block overview ms_small fw-light py-2">{{ item.overview }}</small>
          <div v-if="backdropImages !== null && backdropImagesLength > 0" class="backdrops">
            <h4 class="item-title py-3">Backgrounds</h4>
            <div :ref="`card-info-slider-${item.id}`" class="keen-slider">
              <div :class="'keen-slider__slide number-slide' + index" v-for="(image, index) in backdropImages" data-keen-slider-clickable="false">
                <div class="layover"></div>
                <img class="backdrop-image" :data-splide-lazy="store.ORIGINAL_IMAGE_API_URL + image.file_path" :src="store.ORIGINAL_IMAGE_API_URL + image.file_path" alt="" />
              </div>
              <div v-if="slider && backdropImagesLength > 1" class="dots">
                <button v-for="(_, index) in dotHelper" @click="slider.moveToIdx(index)" :class="{ dot: true, active: current === index }" :key="index"></button>
              </div>
            </div>
          </div>
          <div v-if="director || (production && production.length > 0) || (cast && cast.length > 0)" class="credits">
            <h4 class="item-title pt-4">Credits</h4>
            <div v-if="director" class="directing py-2">
              Directing:
              <span class="fw-bold ms_white">{{ director.name }}</span>
            </div>
            <div v-if="production && production.length > 0" class="production py-2">
              Production:
              <span v-for="(credit, index) in production" class="fw-bold ms_white">
                {{ index !== production.length - 1 ? ' ' + credit.name + ',' : ' ' + credit.name + '.' }}
              </span>
            </div>
            <div v-if="cast && cast.length > 0" class="cast py-2">
              Cast:
              <span v-for="(credit, index) in cast" class="fw-bold ms_white">
                {{ index !== cast.length - 1 ? ' ' + credit.name + ',' : ' ' + credit.name + '.' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style lang="scss" scoped>
@use '../assets/scss/partials/variables' as *;

.layover {
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.4);
  z-index: 2;
}

.outer-layover {
  position: fixed;
  background-color: rgba($color: #000000, $alpha: 0.6);
  z-index: 4;
}

.layover,
.outer-layover {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

[id*='card-info'] {
  position: fixed;
  overflow-y: auto;
  top: 50%;
  left: 50%;
  bottom: 0;
  translate: -50% -50%;
  z-index: 5;
  opacity: 0;
  transform: scale(0.8);
  -webkit-transition: -webkit-transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  -moz-transition: -moz-transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  -o-transition: -o-transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  will-change: transform;
}

[id*='card-info'].h-600 {
  height: 600px;
}

[id*='card-info'].h-content {
  height: fit-content;
}

[id*='card-info'].visible {
  opacity: 1;
  transform: scale(1);
  -webkit-transition: -webkit-transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  -moz-transition: -moz-transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  -o-transition: -o-transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  will-change: transform;
}

.preview-card {
  position: relative;
  width: 586px;
}

.preview-card.gradient {
  background: linear-gradient(to bottom, transparent 300px, $secondary 300px);
}
.preview-card.full {
  background-color: $secondary;
}

.preview {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.close-icon {
  position: absolute;
  right: 0;
  z-index: 3;
  width: 20px;
  height: 20px;
  border: 1px solid $almost-white;
  border-radius: 50%;
  color: $almost-white;
  &:hover {
    cursor: pointer;
  }
}

.preview-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.video {
  position: absolute;
  width: 220%;
  height: 150%;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  z-index: -1;
}

.item-logo {
  position: absolute;
  width: 100%;
  background: linear-gradient(to bottom, transparent, $secondary);
  left: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: end;
}

.item-logo img {
  max-width: 50%;
  max-height: 100px;
  object-fit: contain;
}

#player {
  min-height: 250px;
  pointer-events: none;
}

.controls {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 3;
}

.switch-mute:hover {
  cursor: pointer;
}

.volume-slider {
  overflow: hidden;
  width: 80px;
  -webkit-appearance: none;
  appearance: none;
  background-color: $secondary;
}

.volume-slider::-webkit-slider-runnable-track {
  height: 10px;
  -webkit-appearance: none;
  color: $primary;
  margin-top: -1px;
}

.volume-slider::-webkit-slider-thumb {
  width: 10px;
  -webkit-appearance: none;
  height: 10px;
  cursor: pointer;
  background: #636363;
  box-shadow: -80px 0 0 80px #80141b;
  transition: background 0.25s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  background: $almost-white;
}

.volume-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  margin-inline-end: 0.5rem;
}

.rewind-icon {
  cursor: pointer;
}

.content {
  .cta-buttons > * {
    padding: 0.4rem 0.6rem;
    color: $almost-white;
    cursor: pointer;
  }
  .keen-slider {
    &:hover {
      cursor: grab;
    }
    &:active {
      cursor: grabbing;
    }
  }

  .trailer_btn {
    margin-inline-end: 0.5rem;
    background-color: $primary;
    border: 1px solid $primary;
  }

  .watchlist_btn {
    border: 1px solid $almost-white;
    transition: all 0.25s ease-out;
    .plus-minus {
      position: relative;
      width: 16px;
      height: 16px;

      &:before,
      &:after {
        content: '';
        position: absolute;
        background-color: white;
        transition: transform 0.25s ease-out;
      }

      /* Vertical line */
      &:before {
        top: 0;
        left: 50%;
        width: 2px;
        height: 100%;
        margin-left: -1px;
      }

      /* Horizontal line */
      &:after {
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        margin-top: -1px;
      }
    }
  }
  .watchlist_btn.in-watchlist {
    background-color: $almost-white;
    color: $secondary;
    .plus-minus {
      &:before,
      &:after {
        background-color: $secondary;
      }

      &:before {
        transform: rotate(90deg);
      }
      &:after {
        transform: rotate(180deg);
      }
    }
  }

  .details {
    color: #c9c7c7;
    font-size: 0.75rem;

    .age {
      border: 1px solid #c9c7c7;
      padding: 0.2rem;
    }

    .duration {
      border-left: 1px solid #c9c7c7;
    }
  }

  .rating {
    span {
      display: inline-block;

      color: #029a02;
    }
  }

  .dots {
    display: flex;
    padding: 10px 0;
    justify-content: center;
    position: absolute;
    left: 50%;
    bottom: 0;
    translate: -50%;
    cursor: pointer;
  }
  .dot {
    border: none;
    width: 10px;
    height: 10px;
    background: rgba($color: $secondary, $alpha: 0.7);
    border-radius: 50%;
    margin: 0 5px;
    padding: 5px;
  }
  .dot:focus {
    outline: none;
  }
  .dot.active {
    background: $darker-red;
  }

  .backdrop-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .credits > *:not(.item-title) {
    color: #c9c7c7;
    font-size: 0.75rem;
  }
}
</style>
