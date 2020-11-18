import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    loggedIn: '',
    currentUser: {
      name: '',
      entityId:'',
      role:'',
    },
    gestantesSelectedRowId: ''
  },
  mutations: {
    setUserData(state, payload){
      state.currentUser.name = payload.name;
      state.currentUser.entityId = payload.entityId;
      state.currentUser.role = payload.role;
    },
    handleCurrentSession(state, payload){
      state.loggedIn = payload.value
    },
    setGestanteTableRowSelected(state,payload){
      state.gestantesSelectedRowId = payload.gestantesSelectedRowId
    }
  },
  actions: {},
  modules: {},
  getters:{
    currentUserName: state => {
      return state.currentUser.name
    },
    role: state =>{
      return state.currentUser.role
    },
    entityId: state =>{
      return state.currentUser.entityId
    },
    gestantesSelectedRowId: state =>{
      return state.gestantesSelectedRowId
    },
    loggedIn: state =>{
      return state.loggedIn
    },
  }
});
