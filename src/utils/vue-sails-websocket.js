import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'

export default {
  install (Vue, connection, opts) {
    // Instantiate the socket client (`io`)
    // (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
    Vue.prototype.$io = sailsIOClient(socketIOClient)

    // Set some options:
    // (you have to specify the host and port of the Sails backend when using this library from Node.js)
    Vue.prototype.$io.sails.url = connection
    Vue.prototype.$io.sails.environment = 'development'

    let addListeners = function () {
      if (this.$options['socket']) {
        let conf = this.$options.socket
        if (conf.events) {
          let prefix = conf.prefix || ''
          Object.keys(conf.events).forEach((key) => {
            let func = conf.events[key].bind(this)
            this.$io.socket.on(prefix + key, func)
            conf.events[key].__binded = func
          })
        }
      }
    }

    let removeListeners = function () {
      if (this.$options['socket']) {
        let conf = this.$options.socket
        if (conf.events) {
          let prefix = conf.prefix || ''
          Object.keys(conf.events).forEach((key) => {
            this.$io.socket.off(prefix + key, conf.events[key].__binded)
          })
        }
      }
    }

    Vue.mixin({
      // Vue v1.x
      //beforeCompile: addListeners,

      // Vue v2.x
      beforeCreate: addListeners,
      beforeDestroy: removeListeners
    })
  }
}
