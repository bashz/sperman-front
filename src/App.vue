<template>
  <div id="game">
    <div v-if="player.connected === 1">
      <stages v-if="mode === 'solo'" />
      <rooms v-if="mode === 'multi'" />
      <score-board v-if="mode === 'scoreboard'"/>
      <setting v-if="mode === 'setting'" />
      <div id="menu" v-if="mode === 'menu'">
        <nav-bar :with-button="false"/>
        <img alt="Serpman Logo" src="./assets/logo.png" class="logo" />
        <div class="button-group">
          <button @click="toggle('solo')">Solo</button>
          <button @click="toggle('multi')">Multi</button>
          <button @click="toggle('scoreboard')">Scoreboard</button>
          <button @click="toggle('setting')">Credits</button>
        </div>
      </div>
    </div>
    <div v-if="player.connected !== 1">
      <img alt="Serpman Logo" src="./assets/logo.png" />
      <h1>{{message}}</h1>
    </div>
    <div class="release">
      <span>Version 1.0.0-OpenBeta</span>
    </div>
  </div>
</template>

<script>
import Stages from "./components/Stages";
import Rooms from "./components/Rooms";
import Setting from "./components/Setting";
import ScoreBoard from "./components/ScoreBoard";
import NavBar from "./components/shapes/NavBar"
import store from "./components/store"
export default {
  name: "App",
  store,
  components: {
    Stages,
    Rooms,
    Setting,
    ScoreBoard,
    NavBar
  },
  data() {
    return {
      messages: [
        "Loading, please wait",
        "",
        "Please connect to your Facebook account to proceed",
        "You need to authenticate to the app to proceed",
        "Error while connecting to the game, please reload!"
      ]
    };
  },
  mounted() {
    this.$store.dispatch('login')
  },
  methods: {
    toggle(mode) {
      this.$store.dispatch("switchMode", mode)
    }
  },
  computed: {
    mode() {
      return this.$store.state.mode
    },
    message(){
      return this.messages[this.$store.state.player.connected]
    },
    player() {
      return this.$store.state.player
    }
  }
};
</script>

<style>
#game {
  height: 570px;
  width: 760px;
  background-color: #000000;
}
#menu {
  height: 570px;
  width: 760px;
  background-color: #000000;
}
html {
  font-family: kontrapunkt;
  text-align: center;
  text-anchor: middle;
  color: #ffffff;
}
.logo {
  width: 200px;
  height: 200px;
}
.button-group {
  margin: 0 auto;
  width: 200px;
}
button {
  margin: 24px 0;
  color: #000000;
  text-transform: uppercase;
  background: #ffffff;
  padding: 20px;
  border: 4px solid#000000;
  border-radius: 6px;
  transition: all 0.5s ease 0s;
  cursor: pointer;
  font-family: kontrapunkt;
  width: 200px;
  display: block;
}
button:hover:enabled {
  color: #000000;
  text-shadow: 0px 2px 5px #000000;
  border-radius: 50px;
  border-color: #494949;
  transition: all 0.3s ease 0s;
}
button:disabled {
  cursor: not-allowed;
  color: #000000;
  background: #494949;
  border-color: #494949;
}
.release {
  font-size: 10px;
  margin-top: -10px;
  text-align: right;
}
</style>
