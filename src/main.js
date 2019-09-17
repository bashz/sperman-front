import Vue from 'vue'
import App from './App.vue'
import './assets/KontrBol.css'

Vue.config.productionTip = false

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
