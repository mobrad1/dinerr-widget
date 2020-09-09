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
import loading from 'vuejs-loading-screen'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCMFHjCT-poNivAWBgHR2Jthjph6X7ab0o',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then set installComponents to 'false'.
  //// If you want to automatically install all the components this property must be set to 'true':
  installComponents: true
})
Vue.use(loading,{
        bg: '#b8594159',
        icon: 'spinner',
        size: 2,
        icon_color: 'white',
    
})
var PaystackPop;



Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(vueCustomElement)
Vue.use(VueAxios, axios)
Vue.use(VModal, { componentName: 'Modal' })
App.router = router
App.store = store
Vue.customElement('dinerr-widget', App,{
    props : ['restaurant_id']
})

/* eslint-disable no-new */

