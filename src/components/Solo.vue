<template>
  <div id="solo" tabindex="-1" @keyup.p="pause">
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
      <germ
        v-for="germ in germs"
        :key="germ.id"
        :id="germ.id"
        :d="germ.shape"
        :width="width"
        :height="height"
        :startOn="germ.startOn"
        :speedMin="germ.speedMin"
        :speedRange="germ.speedRange"
        :spawnCycle="spawnCycle"
        :spawnAt="germ.spawnAt"
        :frame="frame"
      />
    </svg>
  </div>
</template>

<script>
import Sperma from "./sprites/Sperma";
import Ovum from "./sprites/Ovum";
import Germ from "./sprites/Germ";
import store from "./store";
export default {
  name: "Solo",
  store,
  components: {
    Sperma,
    Ovum,
    Germ
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
      spawnCycle: 500,
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
    this.$el.focus();
    this.loadAssets();
  },
  methods: {
    pause(e) {
      if (!e.ctrlKey && !e.altKey) {
        this.isPaused = !this.isPaused
      }
    },
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
      if (!(this.won || this.lost || this.isPaused )) this.frame++;
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
          this.spawnCycle = level.spawnCycle || 500;
          level.sprites.forEach((character, i) => {
            const specie = this.sprites.find(
              sprite => sprite.name === character.name
            );
            (character.type === "ovum" ? this.ovums : this.germs).push(
              Object.assign({ id: i }, character, specie)
            );
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
    won() {
      return this.$store.state.allFertelized;
    },
    lost() {
      return this.$store.state.collision;
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
#solo:focus {
  border: none;
}
</style>
