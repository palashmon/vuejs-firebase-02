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
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload;
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    loadMeetups({ commit }) {
      commit('setLoading', true);
      firebase
        .database()
        .ref('meetups')
        .once('value')
        .then(data => {
          const meetups = [];
          const obj = data.val();
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            });
          }
          commit('setLoadedMeetups', meetups);
          commit('setLoading', false);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    createMeetup({ commit, getters }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      };

      // Reach out to firebase and store it
      firebase
        .database()
        .ref('meetups')
        .push(meetup)
        .then(data => {
          const key = data.key;
          commit('createMeetup', {
            ...meetup,
            id: key
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    signUserUp({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(({ user }) => {
          // eslint-disable-next-line
          // debugger;
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          };
          commit('setUser', newUser);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(({ user }) => {
          const newUser = {
            id: user.uid,
            registeredMeetups: []
          };
          commit('setUser', newUser);
        })
        .catch(error => {
          commit('setLoading', false);
          commit('setError', error);
          console.log(error);
        });
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', { id: payload.uid, registeredMeetups: [] });
    },
    logout({ commit }) {
      firebase.auth().signOut();
      commit('setUser', null);
    },
    clearError({ commit }) {
      commit('clearError');
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
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
});
