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
      <sperma
        :width="width"
        :height="height"
        :target="target"
        :frame="frame"
        :viscosity="viscosity"
      />
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
        :vr="germ.vr"
        :spawnCycle="spawnCycle"
        :spawnAt="germ.spawnAt"
        :frame="frame"
      />
    </svg>
    <div class="overlay" v-if="won">
      <button @click="back">back</button>
      <button @click="nextLevel">next</button>
    </div>
    <div class="overlay" v-if="lost || isPaused">
      <button @click="back">back</button>
      <button @click="restartLevel">restart</button>
    </div>
  </div>
</template>

<script>
import Sperma from "../sprites/Sperma";
import Ovum from "../sprites/Ovum";
import Germ from "../sprites/Germ";
import store from "../store";
export default {
  name: "Solo",
  store,
  components: {
    Sperma,
    Ovum,
    Germ
  },
  props: {
    entryLevel: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      level: this.entryLevel,
      height: 600,
      width: 800,
      target: { x: 300, y: 400 },
      frame: 0,
      dev_frame: 0,
      dev_interval: 0,
      spawnCycle: 500,
      viscosity: 0.002,
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
    this.dev_fps();
  },
  methods: {
    dev_fps() {
      clearInterval(this.dev_interval)
      this.dev_frame = this.frame;
      this.dev_interval = setInterval(() => {
        console.log("fps %c" + (this.frame - this.dev_frame), "color: red");
        this.dev_frame = this.frame;
      }, 1000);
    },
    nextLevel() {
      this.level++;
    },
    restartLevel() {
      this.level = new Number(this.level);
    },
    back() {
      this.reset();
      this.$emit("back");
    },
    pause(e) {
      if (!e.ctrlKey && !e.altKey && !this.won) {
        this.isPaused = !this.isPaused;
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
      if (!(this.isPaused || this.lost || this.won))
        this.frame = requestAnimationFrame(this.animate);
    },
    reset() {
      this.$store.dispatch("reset");
      this.germs = [];
      this.ovums = [];
      this.target = { x: 300, y: 400 };
      this.levelReady = false;
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
    loadLevel() {
      fetch(`/mock/levels/${this.level}.json`)
        .then(response => {
          return response.json();
        })
        .then(level => {
          this.spawnCycle = level.spawnCycle || 500;
          this.viscosity = level.viscosity || 0.002;
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
        this.loadLevel();
      }
    },
    levelReady(isReady) {
      if (isReady) {
        this.animate();
        this.$el.focus();
        this.isPaused = false;
      }
    },
    isPaused(isPaused) {
      if (!isPaused) {
        this.animate();
      }
    },
    level() {
      this.reset();
      this.loadLevel();
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
    cancelAnimationFrame(this.frame);
    clearInterval(this.dev_interval)
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}
</style>
