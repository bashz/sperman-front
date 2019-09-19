<template>
  <div id="multi" tabindex="-1" @keyup.p="pause">
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
      <sperma
        :width="width"
        :height="height"
        :target="targetOpponent"
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
          :icon="icons.menu"
        />
        <score :x="width / 2" :y="height / 2" :score="score" :maxScore="maxScore" />
        <menu-button
          @click.native="nextLevel"
          text="Next"
          :width="width"
          :height="height"
          :position="{x: .7, y: .5}"
          :angle="30"
          :icon="icons.next"
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
          :icon="icons.menu"
        />
        <menu-button
          @click.native="restartLevel"
          text="Retry"
          :width="width"
          :height="height"
          :position="{x: .7, y: .5}"
          :angle="30"
          :icon="icons.retry"
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
          :icon="icons.menu"
        />
        <menu-button
          @click.native="pause"
          text="Resume"
          :width="width"
          :height="height"
          :position="{x: .5, y: .5}"
          :angle="0"
          :icon="icons.pause"
        />
        <menu-button
          @click.native="restartLevel"
          text="Retry"
          :width="width"
          :height="height"
          :position="{x: .7, y: .5}"
          :angle="30"
          :icon="icons.retry"
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
import Score from "../shapes/Score";
import store from "../store";
export default {
  name: "multi",
  store,
  components: {
    Sperma,
    Ovum,
    Germ,
    Score,
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
      targetOpponent: { x: 400, y: 300 },
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
      scoreSaved: false,
      icons: {
        menu:
          "M -3.5121951,0 C -3.7816,0 -4,0.27981233 -4,0.62499961 -4,0.97018564 -3.7816,1.2499992 -3.5121951,1.2499992 H 3.512195 C 3.7816,1.2499992 4,0.97018564 4,0.62499961 4,0.27981233 3.7816,0 3.512195,0 Z m 0,3.3749979 C -3.7816,3.3749979 -4,3.654804 -4,3.99999 c 0,0.3451873 0.2184,0.6249996 0.4878049,0.6249996 H 3.512195 C 3.7816,4.6249896 4,4.3451773 4,3.99999 4,3.654804 3.7816,3.3749979 3.512195,3.3749979 Z m 0,3.3750029 C -3.7816,6.7500008 -4,7.0298131 -4,7.3750004 -4,7.7201877 -3.7816,8 -3.5121951,8 H 3.512195 C 3.7816,8 4,7.7201877 4,7.3750004 4,7.0298131 3.7816,6.7500008 3.512195,6.7500008 Z",
        star:
          "m 2.5071808,5.0833915 c -0.048835,0.050732 -0.068369,0.1116114 -0.058602,0.1826368 L 2.7513569,7.1228359 C 2.8001919,7.4069377 2.6927549,7.6808929 2.4681129,7.8533832 2.243471,8.0258735 1.9602269,8.0461665 1.716051,7.9142622 L 0.10448986,7.0315175 c -0.05860222,-0.030439 -0.12697149,-0.030439 -0.18557371,0 L -1.692645,7.9142622 C -1.9368209,8.0461665 -2.220065,8.0258735 -2.4447068,7.8533832 -2.6693486,7.6808929 -2.7767861,7.4069377 -2.7279509,7.1228359 l 0.3027781,-1.8568076 c 0.00977,-0.060879 -0.00977,-0.1319044 -0.058602,-0.1826368 L -3.7827907,3.7643478 C -3.9781314,3.561418 -4.0465007,3.2773163 -3.9683644,3.003361 -3.8804614,2.7294058 -3.6655862,2.5366225 -3.3921092,2.4960365 l 1.7971348,-0.2739552 c 0.068369,-0.010147 0.1172044,-0.050733 0.1465055,-0.1116114 L -0.6475718,0.41600609 C -0.52060032,0.15219735 -0.28619143,0 -0.00294735,0 0.28029673,0 0.51470562,0.15219735 0.6416771,0.41600609 v 0 L 1.4425742,2.1104699 c 0.029301,0.060879 0.078136,0.1014649 0.1465055,0.1116114 l 1.7971348,0.2739552 c 0.2734771,0.040586 0.4883519,0.2333693 0.5762552,0.5073245 0.087903,0.2739553 0.019534,0.558057 -0.1855737,0.7609868 z",
        next:
          "m -1.8709303,6.1155502 v 0 L 0.17703829,4.4824824 c 0.333048,-0.2655752 0.334276,-0.6987248 0,-0.9652794 L -1.8709303,1.8841354 C -2.2039781,1.6185602 -2.4761905,1.7599342 -2.4761905,2.2020904 V 5.797595 c 0,0.443405 0.2709842,0.5845096 0.6052602,0.3179552 z m 0.9215983,1.274205 v 0 C -2.2888518,8.4579 -4,7.5614388 -4,5.797595 V 2.2020904 c 0,-1.7627718 1.7125118,-2.6592174 3.050668,-1.5921602 l 2.0479686,1.6330676 c 1.1373579,0.906939 1.1358642,2.607942 0,3.5136898 z M 2.4761905,0.800005 C 2.4761905,0.3581744 2.818163,0 3.2380952,0 3.6588836,0 4,0.359285 4,0.800005 V 7.1999948 C 4,7.6418256 3.6580274,8 3.2380952,8 2.8173069,8 2.4761905,7.640715 2.4761905,7.1999948 Z",
        retry:
          "m -3.9977676,3.3821564 0.215906,-2.5337579 c 0.022133,-0.2586269 0.1943955,-0.4390948 0.4184791,-0.4390948 0.077065,0 0.1940399,0.023026 0.3120815,0.1328236 l 0.6177633,0.5748202 C -0.948239,-0.38951 1.422994,-0.372287 2.886959,1.1696465 3.604631,1.9252152 3.999911,2.9297698 4,3.9985366 4,5.0673969 3.604898,6.07242 2.887048,6.827895 2.169465,7.583745 1.215088,8 0.200178,8 -0.81482,8 -1.768931,7.583745 -2.4861587,6.828176 -2.7217087,6.58022 -2.9251706,6.301655 -3.0908556,5.9996895 -3.2729847,5.6681453 -3.1651646,5.2434654 -2.8500613,5.0519523 -2.5351353,4.8599712 -2.1322115,4.9736993 -1.950082,5.3053375 -1.841907,5.502186 -1.70911,5.6841515 -1.554714,5.8464603 -1.086192,6.340126 -0.462917,6.612138 0.2,6.612138 c 0.663007,0 1.28637,-0.271825 1.755159,-0.7656777 C 2.423859,5.3530753 2.682075,4.6967264 2.682075,3.9985366 2.681898,3.3003468 2.423859,2.6439978 1.95507,2.150332 1.024248,1.1703016 -0.466295,1.1357618 -1.439872,2.0412838 l 0.594475,0.5531041 c 0.137685,0.1280498 0.195106,0.3037439 0.153685,0.469984 -0.04124,0.1664273 -0.172974,0.290265 -0.352258,0.3311698 L -3.4050704,3.933482 c -0.037688,0.00861 -0.075909,0.012917 -0.1134196,0.012917 -0.1386634,0 -0.2647938,-0.057566 -0.3555472,-0.1619343 -0.092798,-0.1068954 -0.1367079,-0.2498282 -0.1237304,-0.4023083 z",
        pause:
          "M 0,0 C 2.2092444,0 4,1.7908444 4,4 4,6.209244 2.2092444,8 0,8 -2.2091556,8 -4,6.209244 -4,4 -4,1.7908444 -2.2091556,0 0,0 Z M -0.50933333,2.0224 C -0.48897773,1.6902222 -1.2887111,1.6712889 -1.2881778,2.012356 c -0.00151,0.2334222 0,3.638133 0,3.979111 0,0.309422 0.79911113,0.334844 0.79911113,0.01458 M 1.2685333,2.0224 C 1.2888893,1.6902222 0.48897778,1.6712889 0.4896,2.0123556 c -0.001511,0.2334222 0,3.6381334 0,3.9791114 0,0.309422 0.7991111,0.334844 0.7991111,0.01458"
      }
    };
  },
  socket: {
    events: {
      position (data) {
        if (this.$store.state.player.id !== data.uid) {
          this.targetOpponent = data.pos;
        } else {
          this.target = data.pos;
        }
      }
    }
  },
  mounted() {
    this.loadAssets();
    this.$io.socket.get('/multi/subscribe/')
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
      // this.target = { x: e.clientX, y: e.clientY };
      this.streamPosition({ x: e.clientX, y: e.clientY });
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
          this.levelId = level.id;
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
        body: JSON.stringify({ level: this.levelId, score: this.score })
      }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          this.scoreSaved = true;
          if (response.status === 200 || response.status === 201) {
            return response.json()
          }
        }
        // else/catch retry ?
      }).then(data => {
        if (data.endGame) {
          // do end game
        } else if (data.newScore) {
          return this.$store.dispatch("setScore", data.newScore)
        }
      });
    },
    streamPosition (target) {
      fetch(`${process.env.VUE_APP_API_URL}/multi/stream`, {
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({pos: target})
      }).then(response => {
        if (response.status >= 200 && response.status < 300) {
          this.scoreSaved = true;
          if (response.status === 200 || response.status === 201) {
            return response.json()
          }
        }
        // else/catch retry ?
      }).then(data => {
        // do end game ??
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
#multi {
  width: 100%;
  height: 100%;
  background-color: black;
}
#multi:focus {
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
