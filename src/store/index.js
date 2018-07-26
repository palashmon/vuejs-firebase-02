import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        //imageUrl: 'https://bit.ly/1luHTBM',
        imageUrl: 'https://picsum.photos/1920/1080?image=1051',
        id: 'afajfjadfaadfa323',
        title: 'Meetup in New York',
        date: new Date('2018-06-26'),
        location: 'New York',
        description: 'New York, New York!'
      },
      {
        //imageUrl: 'https://bit.ly/1NZ5FP2',
        imageUrl: 'https://picsum.photos/1920/1080?image=1059',
        id: 'aadsfhbkhlk1241',
        title: 'Meetup in Paris',
        date: new Date('2018-06-25'),
        location: 'Paris',
        description: "It's Paris!"
      },
      {
        //imageUrl: 'https://bit.ly/2Kpfdty',
        imageUrl: 'https://picsum.photos/1920/1080?image=865',
        id: 'aadsfhbkhlk1242',
        title: 'Meetup in Vienna',
        date: new Date('2018-06-27'),
        location: 'Vienna',
        description: "It's Vienna, yesss!"
      }
    ],
    user: null
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    setUser(state, payload) {
      state.user = payload;
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
    },
    signUserUp({ commit }, payload) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          // eslint-disable-next-line
          // debugger;
          const newUser = {
            id: user.user.uid,
            registeredMeetups: []
          };
          commit('setUser', newUser);
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => meetupA.date > meetupB.date);
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    loadedMeetup(state) {
      return meetupId => state.loadedMeetups.find(meetup => meetup.id === meetupId);
    },
    user(state) {
      return state.user;
    }
  }
});
