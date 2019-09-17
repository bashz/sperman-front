<template>
  <div id="stages">
    <div v-if="!choosenLevel">
      <nav-bar />
      <svg  :style="style">
        <stage
          v-for="level in levels"
          :key="level.level"
          :level="level"
          @click.native="chooseLevel(level)"
        />
      </svg>
    </div>
    <solo
      v-if="choosenLevel"
      :entry-level="choosenLevel"
      @back="restart"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import Solo from "./games/Solo";
import Stage from "./shapes/Stage";
import NavBar from "./shapes/NavBar";
export default {
  name: "Stages",
  components: {
    Solo,
    Stage,
    NavBar
  },
  data() {
    return {
      levels: [],
      choosenLevel: NaN,
      height: 570,
      width: 760
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);
    this.load();
  },
  methods: {
    load() {
      fetch(`${process.env.VUE_APP_API_URL}/level/`, { credentials: "include" })
        .then(response => {
          return response.json();
        })
        .then(levels => {
          this.levels = levels;
        });
    },
    chooseLevel(level) {
      if (level.isAvailable) {
        this.choosenLevel = level.level;
      }
    },
    restart() {
      this.choosenLevel = NaN;
      this.load();
    },
    resize() {
      this.width = this.$el.clientWidth;
      this.height = this.$el.clientHeight - 4;
    }
  },
  computed: {
    style() {
      return { height: `${this.height}px`, width: `${this.width}px` };
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  }
};
</script>

<style>
#stages {
  width: 100%;
  height: 100%;
  text-align: left;
}
ul {
  padding: 0;
  margin: 0;
}
</style>
