<template>
  <div id="stages"> 
    <ul v-if="!choosenLevel">
      <li v-for="level in levels" :key="level.level">
        <strong v-if="level.isAvailable" @click="chooseLevel(level.level)">{{level.level}}</strong>
        <i v-if="!level.isAvailable">{{level.level}}</i>
      </li>
    </ul>
    <solo v-if="choosenLevel" :entry-level="choosenLevel" @back="restart" />
  </div>
</template>

<script>
import Solo from "./games/Solo";
export default {
  name: "Stages",
  components: {
    Solo
  },
  data() {
    return {
      levels: [],
      choosenLevel: NaN
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      fetch(`/mock/levels.json`)
        .then(response => {
          return response.json();
        })
        .then(levels => {
          this.levels = levels;
        });
    },
    chooseLevel(level) {
      this.choosenLevel = level;
    },
    restart() {
      this.choosenLevel = NaN;
    }
  }
};
</script>

<style>
#stages {
  width: 100%;
  height: 100%;
  background-color: #000;
  color: #fff;
}
ul {
  padding: 0;
  margin: 0;
}
</style>
