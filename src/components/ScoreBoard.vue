<template>
  <div id="scoreboard">
    <nav-bar :with-player="false"/>
    <div v-for="(player, index) in topTen" :key="player.id" class="score-row">
      <div class="score-item score-index">{{index + 1}}</div>
      <div class="score-item score-name">{{player.name || 'Guest'}}</div>
      <div class="score-item score-number">{{player.totalScore}}</div>
    </div>
    <br>
    <div v-if="extraPlayer" class="score-row">
      <div class="score-item score-index">>10</div>
      <div class="score-item score-name">{{extraPlayer.name}}</div>
      <div class="score-item score-number">{{extraPlayer.totalScore}}</div>
    </div>
  </div>
</template>

<script>
import NavBar from "./shapes/NavBar"
import store from "./store"
export default {
  name: "ScoreBoard",
  components: {
    NavBar
  },
  store,
  data() {
    return {
      topTen: []
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      fetch(`${process.env.VUE_APP_API_URL}/scoreboard/`, {
        credentials: "include"
      })
        .then(response => {
          return response.json();
        })
        .then(players => {
          this.topTen = players;
        });
    }
  },
  computed: {
    extraPlayer() {
      if (this.topTen.find(player => player.id === this.$store.state.player.id)) {
        return null
      } else {
        return this.$store.state.player
      }
    }
  }
};
</script>

<style>
.score-row {
  width: 50%;
  margin: auto;
  border-bottom: 2px solid #ffffff;
}
.score-item {
  display: inline-block;
  line-height: 40px;
  height: 30px;
  padding: 16px 0 0 0;
}
.score-index {
  width: 10%;
}
.score-name {
  width: 50%;
  padding: 0 5%;
  text-align: right;
}
.score-number {
  width: 30%;
  text-align: left;
  text-shadow: 0px -2px 5px #ffff00;
}
</style>