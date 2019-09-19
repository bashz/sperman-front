import Vue from 'vue'
import App from './App.vue'
import './assets/KontrBol.css'
import Websocket from './utils/vue-sails-websocket'

Vue.config.productionTip = false

// Websocket
Vue.use(Websocket, process.env.VUE_APP_API_URL)

window.fbAsyncInit = () => {
  FB.init({
    appId: process.env.VUE_APP_FB_APP_ID,
    autoLogAppEvents: true,
    xfbml: false,
    status: true,
    version: 'v4.0'
  });

  new Vue({
    render: h => h(App),
  }).$mount('#app')
};
