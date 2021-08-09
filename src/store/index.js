import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  /** ***** STATES ***** **/
  state:{
    dataItems:[
        {
            "id":1,
            "first_name": "Sohrab",
            "last_name": "Sheikhani",
            "phone_number": "4244048668",
            "dial_code":"+1",
            "code":"US",
            "country":"United States",
            "created_at": "2021-07-08 16:00:00",
            "favorite": false
        },
        {
            "id":2,
            "first_name": "MHon",
            "last_name": "Romero",
            "phone_number": "9163086379",
            "dial_code":"+63",
            "code":"PH",
            "country":"Philippines",
            "created_at": "2021-07-08 17:31:00",
            "favorite": true
        },
        {
            "id":3,
            "first_name": "Mharrian",
            "last_name": "HR",
            "phone_number": "8184839617",
            "dial_code":"+1",
            "code":"US",
            "country":"United States",
            "created_at": "2021-07-08 17:40:00",
            "favorite": false
        },
        {
          "id":4,
          "first_name": "Mia",
          "last_name": "Barns",
          "phone_number": "9082711588",
          "dial_code":"+63",
          "code":"PH",
          "country":"Philippines",
          "created_at": "2021-07-08 18:30:00",
          "favorite": false
      }
    ]
  },

  /** ***** MUTATIONS ***** **/
  mutations:{
    UPDATE_FAVORITE(state, payload){
      var index = state.dataItems.findIndex(x => x.id == payload.id);
      state.dataItems[index].favorite = payload.favorite
    },

    DELETE_CONTACT(state, payload){
      var index = state.dataItems.findIndex(x => x.id == payload.id);
      state.dataItems.splice(index)
    },

    UPDATE_CONTACT(state, payload){
      var index = state.dataItems.findIndex(x => x.id == payload.id);
      state.dataItems[index] = payload
    },

    ADD_CONTACT(state, payload){
      state.dataItems.push(payload)
    }
  },

  /** ***** ACTIONS ***** **/
  actions:{
    changeFavoriteStatus({ commit }, payload){
      return new Promise((resolve) => {
        try{
          commit('UPDATE_FAVORITE', payload)
          resolve()
        } catch (error) {}
      })
    },

    deleteContact({ commit }, payload){
      return new Promise((resolve) => {
        try{
          commit('DELETE_CONTACT', payload)
          resolve()
        } catch (error) {}
      })
    },

    updateContact({ commit }, payload){
      return new Promise((resolve) => {
        try{
          commit('UPDATE_CONTACT', payload)
          resolve()
        } catch (error) {}
      })
    },

    addContact({ commit }, payload){
      return new Promise((resolve) => {
        try{
          commit('ADD_CONTACT', payload)
          resolve()
        } catch (error) {}
      })
    },
  },

  /** ***** PLUGINS ***** **/
  plugins: [createPersistedState()],
})