import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://bit.ly/1luHTBM',
        id: 'afajfjadfaadfa323',
        title: 'Meetup in New York',
        date: '2018-06-26',
        location: 'New York',
        description: 'New York, New York!'
      },
      {
        imageUrl: 'https://bit.ly/1NZ5FP2',
        id: 'aadsfhbkhlk1241',
        title: 'Meetup in Paris',
        date: '2018-06-25',
        location: 'Paris',
        description: 'It\'s Paris!'
      },
      {
        imageUrl: 'https://bit.ly/2Kpfdty',
        id: 'aadsfhbkhlk1242',
        title: 'Meetup in Vienna',
        date: '2018-06-27',
        location: 'Vienna',
        description: 'It\'s Vienna, yesss!'
      }
    ],
    user: {
      id: 'ajaldslfalsk12',
      registeredMeetups: ['aadsfhbkhlk1241']
    }
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    }
  },
  actions: {
    createMeetup({ commit }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        id: 'kfdlsfjslakl12'
      };
      // Reach out to firebase and store it
      commit('createMeetup', meetup);
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => meetupA.date > meetupB.date);
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.sort((meetupA, meetupB) => meetupA.date > meetupB.date).slice(0, 5);
    },
    loadedMeetup(state) {
      return meetupId => state.loadedMeetups.find(meetup => meetup.id === meetupId);
    }
  }
});
