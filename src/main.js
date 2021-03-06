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
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog.vue';
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog.vue';
import EditMeetupTimeDialog from './components/Meetup/Edit/EditMeetupTimeDialog.vue';
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue';

Vue.use(Vuetify);
Vue.config.productionTip = false;
Vue.filter('date', DateFilter);
Vue.component('app-alert', AlertCmp);
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog);
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog);
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog);
Vue.component('app-meetup-register-dialog', RegisterDialog);

// require and load dotenv
require('dotenv').config({ path: '../config/dev.env' });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    // Initialize Firebase
    const config = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET
    };
    firebase.initializeApp(config);

    // Get the currently signed-in user
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user);
        this.$store.dispatch('fetchUserData');
      }
    });

    // Load the saved meetups from database
    this.$store.dispatch('loadMeetups');
  }
});
