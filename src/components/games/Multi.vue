<template>
  <div id="multi" tabindex="-1">
    <svg :style="style" @mousemove="ejaculate" v-if="assetsLoaded">
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
        v-for="player in players"
        :key="player.id"
        :id="player.id"
        :color="player.color"
        :width="width"
        :height="height"
        :target="target"
        :frame="frame"
        :viscosity="viscosity"
        :room="room"
      />
      <text
        v-for="(player, index) in players"
        :key="player.scoreId"
        y="20"
        :x="positionateScore(index)"
        :style="{fill: player.color, stroke: player.color}"
      >{{player.score.toFixed(2)}}</text>
    </svg>
  </div>
</template>

<script>
import Sperma from "../sprites/Sperma";
import Ovum from "../sprites/Ovum";
import store from "../store";
export default {
  name: "multi",
  store,
  components: {
    Sperma,
    Ovum
  },
  props: {
    height: {
      type: Number,
      default: 570
    },
    width: {
      type: Number,
      default: 760
    },
    starters: {
      type: Array,
      default() {
        return [];
      }
    },
    currentPlayer: {
      type: Number,
      default: 0
    },
    room: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      target: { x: 300, y: 400 },
      frame: 0,
      viscosity: 0.002,
      sprites: [],
      ovums: [],
      scheme: ["#fa5c18", "#7189bf", "#ffd881", "#d97b7a"],
      assetsLoaded: false,
      levelReady: false,
      players: []
    };
  },
  socket: {
    events: {
      score(data) {
        const score = this.players[this.players.map(p => p.id).indexOf(data.id)].score
        let newScore = data.score + score
        if (newScore <= 0) newScore = 0
        if (score) {
          this.players[this.players.map(p => p.id).indexOf(data.id)].score = newScore
        } else {
          if (newScore) {
            this.players[this.players.map(p => p.id).indexOf(data.id)].score = newScore
          }
        }
      }
    }
  },
  mounted() {
    this.loadAssets();
    this.players = this.starters.map((player, i) => {
      player.color = this.scheme[i];
      player.score = 0;
      player.scoreId = `sc-${player.id}`;
      return player;
    });
    this.$io.socket.get(`/multi/${this.room}/${this.currentPlayer}`, (room, res) => {});
  },
  methods: {
    place(percent, isVertical) {
      return percent * (isVertical ? this.height : this.width);
    },
    positionateScore(index) {
      if (this.players.length)
        return (
          this.width * (0.5 / this.players.length + index / this.players.length)
        );
      return this.width / 2;
    },
    ejaculate(e) {
      this.target = { x: e.clientX, y: e.clientY, id: this.currentPlayer };
      // this.streamPosition({ x: e.clientX, y: e.clientY });
    },
    animate() {
      this.frame = requestAnimationFrame(this.animate);
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
    }
  },
  watch: {
    assetsLoaded(isReady) {
      if (isReady) {
        this.ovums = [
          {
            id: 0,
            name: "alpha",
            shape: this.sprites.find(sprite => sprite.name === "alpha").shape,
            type: "ovum",
            vr: 1,
            vx: 0,
            vy: 0,
            x: 0.5,
            y: 0.5
          }
        ];
        this.animate();
      }
    }
  },
  computed: {
    style() {
      return { height: `${this.height}px`, width: `${this.width}px` };
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
