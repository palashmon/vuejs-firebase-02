import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import './assets/main.css';
import App from './App';
import router from './router';
import { store } from './store';
import DateFilter from './filters/date';
import firebase from 'firebase/app';
import AlertCmp from './components/Shared/Alert.vue';

Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.filter('date', DateFilter);
Vue.component('app-alert', AlertCmp);

// require and load dotenv
require('dotenv').config({ path: '../config/dev.env' });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET
    });
  }
});
