<template>
  <div id="solo">
    <svg :style="style" @mousemove="ejaculate" v-if="levelReady">
      <ovum
        v-for="ovum in ovums"
        :key="ovum.key"
        :id="ovum.key"
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
    <p v-if="done">Done</p>
  </div>
</template>

<script>
import Sperma from "./sprites/Sperma.vue";
import Ovum from "./sprites/Ovum.vue";
import store from './store'
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
      levelReady: false
    };
  },
  mounted() {
    this.animate();
    this.loadAssets();
  },
  methods: {
    place(percent, isVertical) {
      return percent * (isVertical ? this.height : this.width);
    },
    ejaculate(e) {
      this.target = { x: e.clientX, y: e.clientY };
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.frame++;
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
          level.sprites.forEach(character => {
            if (character.type === "ovum") {
              const specie = this.sprites.find(
                sprite => sprite.name === character.name
              );
              this.ovums.push(Object.assign({}, character, specie));
            } else {
              // germs
            }
          });
          this.levelReady = true;
        });
    },
    process (sperma, ovum) {

    }
  },
  watch: {
    assetsLoaded(isReady) {
      if (isReady) {
        this.loadLevel(this.level);
      }
    }
  },
  computed: {
    style() {
      return { height: `${this.height}px`, width: `${this.width}px` };
    },
    done() {
      return this.$store.state.allFertelized
    }
  }
};
</script>

<style>
svg {
  background-color: black;
}
</style>
