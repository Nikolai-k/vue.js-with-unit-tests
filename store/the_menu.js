import Vue from 'vue';

export default {
  namespaced: true,
  state() {
    return {
      menu: [],
      menu_is_visible: false,
    };
  },
  mutations: {
    SET_MENU(state, menu) {
      Vue.set(state, 'menu', menu);
    },
    SET_MENU_VISIBLE(state, menu_is_visible) {
      Vue.set(state, 'menu_is_visible', menu_is_visible);
    },
  },
};
