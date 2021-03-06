import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForMeetup(state, payload) {
      const id = payload.id;
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return;
      }
      state.user.registeredMeetups.push(id);
      state.user.fbKeys[id] = payload.fbKey;
    },
    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups;
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1);
      Reflect.deleteProperty(state.user.fbKeys, payload);
    },
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload;
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    updateMeetup(state, payload) {
      const meetup = state.loadedMeetups.find(meetup => meetup.id === payload.id);
      if (payload.title) {
        meetup.title = payload.title;
      }
      if (payload.description) {
        meetup.description = payload.description;
      }
      if (payload.date) {
        meetup.date = payload.date;
      }
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
    registerUserForMeetup({ commit, getters }, payload) {
      commit('setLoading', true);
      const user = getters.user;
      firebase
        .database()
        .ref('/users/' + user.id)
        .child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false);
          commit('registerUserForMeetup', { id: payload, fbKey: data.key });
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    unregisterUserFromMeetup({ commit, getters }, payload) {
      commit('setLoading', true);
      const user = getters.user;
      if (!user.fbKeys) {
        return;
      }
      const fbKey = user.fbKeys[payload];
      firebase
        .database()
        .ref('/users/' + user.id + '/registrations/')
        .child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false);
          commit('unregisterUserFromMeetup', payload);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
    },
    async loadMeetups({ commit }) {
      try {
        commit('setLoading', true);
        const data = await firebase
          .database()
          .ref('meetups')
          .once('value');
        const meetups = [];
        const obj = data.val();
        for (let key in obj) {
          meetups.push({
            id: key,
            title: obj[key].title,
            description: obj[key].description,
            imageUrl: obj[key].imageUrl,
            date: obj[key].date,
            location: obj[key].location,
            creatorId: obj[key].creatorId
          });
        }
        commit('setLoadedMeetups', meetups);
        commit('setLoading', false);
      } catch (error) {
        console.log(error.message);
        commit('setLoading', false);
      }
    },
    async createMeetup({ commit, getters }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      };

      // Reach out to firebase and store it
      try {
        const { key } = await firebase
          .database()
          .ref('meetups')
          .push(meetup);
        const filename = payload.image.name;
        const ext = filename.slice(filename.lastIndexOf('.'));
        const fileData = await firebase
          .storage()
          .ref('meetups/' + key + '.' + ext)
          .put(payload.image);
        const imageUrl = fileData.metadata.downloadURLs[0];
        await firebase
          .database()
          .ref('meetups')
          .child(key)
          .update({ imageUrl });
        commit('createMeetup', { ...meetup, imageUrl, id: key });
      } catch (error) {
        console.log(error.message);
      }
    },

    async updateMeetupData({ commit }, payload) {
      commit('setLoading', true);
      const updateObj = {};
      if (payload.title) {
        updateObj.title = payload.title;
      }
      if (payload.description) {
        updateObj.description = payload.description;
      }
      if (payload.date) {
        updateObj.date = payload.date;
      }
      try {
        await firebase
          .database()
          .ref('meetups')
          .child(payload.id)
          .update(updateObj);

        commit('setLoading', false);
        commit('updateMeetup', payload);
      } catch (error) {
        console.log(error.message);
        commit('setLoading', false);
      }
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
            registeredMeetups: [],
            fbKeys: {}
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
            registeredMeetups: [],
            fbKeys: {}
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
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      });
    },
    fetchUserData({ commit, getters }) {
      commit('setLoading', true);
      firebase
        .database()
        .ref('/users/' + getters.user.id + '/registrations/')
        .once('value')
        .then(data => {
          const dataPairs = data.val();
          let registeredMeetups = [];
          let swappedPairs = {};
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key]);
            swappedPairs[dataPairs[key]] = key;
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups,
            fbKeys: swappedPairs
          };
          commit('setLoading', false);
          commit('setUser', updatedUser);
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false);
        });
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
