<template>
  <div id="stages">
    <svg v-if="!choosenLevel" :style="style">
      <stage
        v-for="level in levels"
        :key="level.level"
        :level="level"
        @click.native="chooseLevel(level)"
      />
    </svg>
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
export default {
  name: "Stages",
  components: {
    Solo,
    Stage
  },
  data() {
    return {
      levels: [],
      choosenLevel: NaN,
      height: 600,
      width: 800
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);
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
      if (level.isAvailable) {
        this.choosenLevel = level.level;
      }
    },
    restart() {
      this.choosenLevel = NaN;
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
  background-color: #000;
  color: #fff;
}
ul {
  padding: 0;
  margin: 0;
}
</style>
