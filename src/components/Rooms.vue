<template>
  <div id="rooms">
    <div v-if="!allReady">
      <nav-bar />
      <div v-if="roomId">
        <br />
        <h2>ROOM {{roomId}}</h2>
        <div
          v-for="(player, index) in players"
          :key="player.id"
          :style="{color: player.isReady || (player.id === currentPlayer.id && ready) ? scheme[index] : '#666666'}"
          class="player-zone"
        >
          <span :style="{color: scheme[index]}">{{player.name}}</span>
          <div
            class="player-status"
            v-if="player.id !== currentPlayer.id"
          >{{player.isReady? 'READY' : 'NOT READY'}}</div>
          <div
            class="player-status"
            v-if="player.id === currentPlayer.id"
          >{{ready? 'READY' : 'NOT READY'}}</div>
        </div>
      </div>
      <button @click="setReady" class="ready">{{ready? 'WAIT' : 'I AM READY'}}</button>
    </div>
    <multi v-if="allReady" :starters="players" :currentPlayer="currentPlayer.id" :room="roomId"></multi>
  </div>
</template>

<script>
import NavBar from "./shapes/NavBar";
import Multi from "./games/Multi"
import store from "./store";
export default {
  name: "Rooms",
  store,
  components: {
    NavBar,
    Multi
  },
  data() {
    return {
      roomId: 0,
      allReady: false,
      ready: false,
      players: [],
      scheme: ["#fa5c18", "#7189bf", "#ffd881", "#d97b7a"],
      height: 570,
      width: 760
    };
  },
  methods: {
    setReady() {
      this.$io.socket.get(
        `/room/${this.roomId}/${!this.ready}`,
        (data, res) => {
          this.ready = data.player.isReady;
          this.allReady = data.allReady;
        }
      );
    },
    startGame() {}
  },
  socket: {
    events: {
      joined(data) {
        this.players.push(data.player);
      },
      left(data) {
        this.players.splice(
          this.players.map(p => p.id).indexOf(data.player.id),
          1
        );
      },
      status(data) {
        this.$set(
          this.players[this.players.map(p => p.id).indexOf(data.player.id)],
          "isReady",
          data.player.isReady
        );
      },
      ready(data) {
        this.allReady = data.allReady;
      }
    }
  },
  computed: {
    currentPlayer() {
      return this.$store.state.player;
    }
  },
  mounted() {
    this.$io.socket.get("/room/join/", (room, res) => {
      this.roomId = room.id;
      this.players = [...room.players, this.currentPlayer];
      this.$io.socket.get(`/room/${this.roomId}/${this.ready}`, (data, res) => {
        this.allReady = data.allReady;
      });
    });
  },
  beforeDestroy() {
    this.$io.socket.get("/room/leave/", (data, res) => {
      this.roomId = 0;
    });
  }
};
</script>

<style>
.player-zone {
  width: 40%;
  border: solid 3px;
  max-height: 30%;
  margin: 4%;
  font-size: 18px;
  display: inline-block;
}
.player-status {
  margin-top: 40px;
  font-size: 24px;
}
.ready {
  position: absolute;
  bottom: 50px;
  left: 290px;
}
</style>
