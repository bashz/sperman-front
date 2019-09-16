<template>
  <div class="nav-bar">
    <a v-if="withButton" @click="goBack" class="nav-bar-back">Back</a>
    <div class="nav-bar-player" v-if="withPlayer">
      <span>{{name}}: {{score}}</span>
    </div>
  </div>
</template>

<script>
import store from "../store";
export default {
  name: "NavBar",
  store,
  props: {
    withButton: {
      type: Boolean,
      default: true
    },
    withPlayer: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goBack() {
      this.$store.dispatch("switchMode", "menu");
    }
  },
  computed: {
    name() {
      return this.$store.state.player.name;
    },
    score() {
      return this.$store.state.player.score;
    }
  }
};
</script>

<style>
.nav-bar {
  position: fixed;
  width: 800px;
}
.nav-bar-back {
  width: 27%;
  padding-left: 3%;
  text-align: left;
  float: left;
  cursor: pointer;
}
.nav-bar-player {
  width: 67%;
  padding-right: 3%;
  text-align: right;
  float: right;
}
</style>