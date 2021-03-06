import 'core-js';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import 'shared/i18n/setup';
// Polyfill indexeddb
import 'fake-indexeddb/auto';
import jquery from 'jquery';
import { setupSchema } from 'shared/data';
import icons from 'shared/vuetify/icons';

window.jQuery = window.$ = jquery;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuetify, {
  icons: icons(),
});

Vue.config.silent = true;
Vue.config.productionTip = false;

const csrf = global.document.createElement('input');
csrf.name = 'csrfmiddlewaretoken';
csrf.value = 'csrfmiddlewaretoken';
global.document.body.append(csrf);
global.document.body.setAttribute('data-app', true);
global.window.Urls = new Proxy(
  {},
  {
    get(obj, prop) {
      return () => prop;
    },
  }
);

// This global object is bootstraped into channel_edit.html and is
// assumed by the frontend code for it
global.window.CHANNEL_EDIT_GLOBAL = {
  channel_id: '',
  channel_error: '',
}

setupSchema();
