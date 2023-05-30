import { createApp } from 'vue';
import Portal from 'vue3-portal';
import './assets/scss/style.scss';
import 'keen-slider/keen-slider.min.css';
import App from './App.vue';
import { router } from './router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faCircleInfo,
  faMagnifyingGlass,
  faVolumeXmark,
  faVolumeOff,
  faVolumeLow,
  faVolumeHigh,
  faRotateLeft,
  faStar,
  faPlus,
  faPlay,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faMinus,
  faChartSimple,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

//FontAwesome
library.add(
  faCircleInfo,
  faHeart,
  faMagnifyingGlass,
  faVolumeXmark,
  faVolumeOff,
  faVolumeLow,
  faVolumeHigh,
  faRotateLeft,
  faStar,
  faPlus,
  faPlay,
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faMinus,
  faChartSimple,
  faCirclePlus
);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router, Portal).mount('#app');
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
