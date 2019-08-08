<template>
  <div id="solo">
    <svg :style="style" @mousemove="ejaculate" v-if="levelReady">
      <ovum
        v-for="ovum in ovums"
        :key="ovum.id"
        :id="ovum.id"
        :d="ovum.shape"
        :width="width"
        :height="height"
        :originX="place(ovum.x)"
        :originY="place(ovum.y, true)"
        :originVX="ovum.vx"
        :originVY="ovum.vy"
        :vr="ovum.vr"
        :frame="frame"
      />
      <sperma :width="width" :height="height" :target="target" :frame="frame" />
    </svg>
  </div>
</template>

<script>
import Sperma from "./sprites/Sperma.vue";
import Ovum from "./sprites/Ovum.vue";
import store from "./store";
export default {
  name: "Solo",
  store,
  components: {
    Sperma,
    Ovum
  },
  props: {
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      height: 600,
      width: 800,
      target: { x: 300, y: 400 },
      frame: 0,
      sprites: [],
      germs: [],
      ovums: [],
      assetsLoaded: false,
      levelReady: false,
      isPaused: false
    };
  },
  mounted() {
    this.resize();
    window.addEventListener("resize", this.resize);
    this.loadAssets();
  },
  methods: {
    resize() {
      this.width = this.$el.clientWidth;
      this.height = this.$el.clientHeight - 4;
    },
    place(percent, isVertical) {
      return percent * (isVertical ? this.height : this.width);
    },
    ejaculate(e) {
      this.target = { x: e.clientX, y: e.clientY };
    },
    animate() {
      requestAnimationFrame(this.animate);
      if (!(this.done || this.isPaused)) this.frame++;
    },
    loadAssets() {
      fetch("/mock/sprites.json")
        .then(response => {
          return response.json();
        })
        .then(sprites => {
          this.sprites = sprites;
          this.assetsLoaded = true;
        });
    },
    loadLevel(level) {
      fetch(`/mock/levels/${level}.json`)
        .then(response => {
          return response.json();
        })
        .then(level => {
          level.sprites.forEach((character, i) => {
            if (character.type === "ovum") {
              const specie = this.sprites.find(
                sprite => sprite.name === character.name
              );
              this.ovums.push(Object.assign({id: i}, character, specie));
            } else {
              // germs
            }
          });
          this.levelReady = true;
        });
    }
  },
  watch: {
    assetsLoaded(isReady) {
      if (isReady) {
        this.loadLevel(this.level);
      }
    },
    levelReady(isReady) {
      if (isReady) {
        this.animate();
      }
    }
  },
  computed: {
    style() {
      return { height: `${this.height}px`, width: `${this.width}px` };
    },
    done() {
      return this.$store.state.allFertelized;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  }
};
</script>

<style>
svg {
  background-color: black;
}
#solo {
  width: 100%;
  height: 100%;
}
</style>
