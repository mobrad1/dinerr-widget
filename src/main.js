// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import vueCustomElement from 'vue-custom-element'
import VModal from 'vue-js-modal'
import Vuex from 'vuex'
import { currency } from './currency'
Vue.filter('currency', currency)
var PaystackPop;



Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(vueCustomElement)
Vue.use(VueAxios, axios)
Vue.use(VModal, { componentName: 'Modal' })
App.router = router
App.store = store
Vue.customElement('vue-widget', App,{
    props : ['restaurant_id']
})

/* eslint-disable no-new */

