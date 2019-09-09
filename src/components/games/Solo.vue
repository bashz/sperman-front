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
      <svg :style="style">
        <menu-button
          @click.native="back"
          text="Menu"
          :width="width"
          :height="height"
          :position="{x: .3, y: .5}"
          :angle="-30"
        />
        <menu-button
          v-if="scoreSaved"
          :text="score.toString()"
          :clickable="false"
          :width="width"
          :height="height"
          :position="{x: .5, y: .5}"
          :angle="0"
        />
        <menu-button
          @click.native="nextLevel"
          text="Next"
          :width="width"
          :height="height"
          :position="{x: .7, y: .5}"
          :angle="30"
        />
      </svg>
    </div>
    <div class="overlay" v-if="lost">
      <svg :style="style">
        <menu-button
          @click.native="back"
          text="Menu"
          :width="width"
          :height="height"
          :position="{x: .3, y: .5}"
          :angle="-30"
        />
        <menu-button
          @click.native="restartLevel"
          text="Retry"
          :width="width"
          :height="height"
          :position="{x: .7, y: .5}"
          :angle="30"
        />
      </svg>
    </div>
    <div class="overlay" v-if="isPaused">
      <svg :style="style">
        <menu-button
          @click.native="back"
          text="Menu"
          :width="width"
          :height="height"
          :position="{x: .3, y: .5}"
          :angle="-30"
        />
        <menu-button
          @click.native="pause"
          text="Resume"
          :width="width"
          :height="height"
          :position="{x: .5, y: .5}"
          :angle="0"
        />
        <menu-button
          @click.native="restartLevel"
          text="Retry"
          :width="width"
          :height="height"
          :position="{x: .7, y: .5}"
          :angle="30"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import Sperma from "../sprites/Sperma";
import Ovum from "../sprites/Ovum";
import Germ from "../sprites/Germ";
import MenuButton from "../shapes/MenuButton";
import store from "../store";
export default {
  name: "Solo",
  store,
  components: {
    Sperma,
    Ovum,
    Germ,
    MenuButton
  },
  props: {
    height: {
      type: Number,
      default: 600
    },
    width: {
      type: Number,
      default: 800
    },
    entryLevel: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      level: this.entryLevel,
      target: { x: 300, y: 400 },
      frame: 0,
      spawnCycle: 500,
      viscosity: 0.002,
      sprites: [],
      germs: [],
      ovums: [],
      maxScore: 50000,
      minScore: 5000,
      score: 0,
      assetsLoaded: false,
      levelReady: false,
      isPaused: false,
      firstFrame: 0,
      scoreSaved: false
    };
  },
  mounted() {
    this.loadAssets();
  },
  methods: {
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
      this.score = 0;
      this.scoreSaved = false;
    },
    loadAssets() {
      fetch(`${process.env.VUE_APP_API_URL}/sprite/`, {
        mode: "cors",
        credentials: "include"
      })
        .then(response => {
          return response.json();
        })
        .then(sprites => {
          this.sprites = sprites;
          this.assetsLoaded = true;
        });
    },
    loadLevel() {
      fetch(`${process.env.VUE_APP_API_URL}/level/${this.level}`, {
        mode: "cors",
        credentials: "include"
      })
        .then(response => {
          return response.json();
        })
        .then(level => {
          this.spawnCycle = level.spawnCycle || 500;
          this.viscosity = level.viscosity || 0.002;
          this.maxScore = level.maxScore || 50000;
          this.minScore = level.minScore || 5000;
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
    },
    submitScore() {
      fetch(`${process.env.VUE_APP_API_URL}/score`, {
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ level: this.level, score: this.score })
      }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          this.scoreSaved = true;
        }
        // else/catch retry ?
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
        this.firstFrame = this.frame;
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
    },
    won(hasWon) {
      if (hasWon) {
        const absoluteScore = this.maxScore - (this.frame - this.firstFrame);
        this.score =
          absoluteScore < this.minScore ? this.minScore : absoluteScore;
        this.submitScore();
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
    cancelAnimationFrame(this.frame);
  }
};
</script>

<style>
#solo {
  width: 100%;
  height: 100%;
  background-color: black;
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
