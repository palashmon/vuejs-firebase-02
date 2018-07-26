import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './App';
import router from './router';
import { store } from './store';
import DateFilter from './filters/date';
import firebase from 'firebase/app';

Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.filter('date', DateFilter);

// require and load dotenv
require('dotenv').load();

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
