<template>
  <g :opacity="isStunned? 0.6 : 1">
    <ellipse rx="8" ry="5" :fill="color" :stroke-width="collided" stroke="#ffffff" :transform="head"></ellipse>
    <path class="mid" :stroke="color" :d="mid"></path>
    <path class="tail" :stroke="color" :d="tail"></path>
  </g>
</template>

<script>
import store from "../store";
const degrees = 180 / Math.PI;
export default {
  name: "Sperma",
  store,
  props: {
    id: {
      type: Number,
      default: 0
    },
    // Game dimensions
    width: {
      type: Number,
      default: 760
    },
    height: {
      type: Number,
      default: 570
    },
    // Tad's initial position
    originX: {
      type: Number,
      default: 400
    },
    originY: {
      type: Number,
      default: 500
    },
    // Tad's color
    color: {
      type: String,
      default: "#ffffff"
    },
    // The more the fluid is viscos the more the deceleration is important 0..1
    viscosity: {
      type: Number,
      default: 0.002
    },
    // The more power the more the tad react to the mouse
    power: {
      type: Number,
      default: 0.03
    },
    // X,Y for the tad to go to
    target: {
      type: Object,
      default() {
        return { x: 300, y: 400, id: -1 };
      }
    },
    // The number of actual frame
    frame: {
      type: Number,
      default: 0
    },
    // For other players
    room: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      count: 0,
      vx: 0,
      vy: -1,
      tailX: new Array(12).fill(this.originX),
      tailY: new Array(12).fill(this.originY),
      head: "",
      mid: "",
      tail: "",
      foreign: {},
      isStunned: 0,
      collided: 0
    };
  },
  socket: {
    events: {
      foreign(data) {
        this.foreign = data;
      },
      collision(data) {
        if (data.id === this.id) {
          this.collided = 15;
          this.isStunned = data.stunned;
          this.vx = data.vx;
          this.vy = data.vy;
        }
      }
    }
  },
  watch: {
    target() {
      if (this.id === this.target.id && !this.isStunned) {
        this.vx = this.power * (this.target.x - this.tailX[0]);
        this.vy = this.power * (this.target.y - this.tailY[0]);
      }
    },
    frame() {
      if (this.isStunned) {
        this.isStunned--;
      }
      if (this.collided) {
        this.collided--;
      }
      if (this.id === this.target.id) {
        this.swim();
        if (!this.id) {
          this.$store.dispatch("spermaMoved", {
            id: this.id,
            tailX: this.tailX,
            tailY: this.tailY
          });
        } else {
          this.$io.socket.post(`/multi/${this.room}`, {
            id: this.id,
            head: this.head,
            mid: this.mid,
            tail: this.tail,
            x: this.tailX[0],
            y: this.tailY[0],
            vx: this.vx,
            vy: this.vy,
            isStunned: this.isStunned
          });
        }
      } else {
        this.draw();
      }
    }
  },
  methods: {
    swim() {
      let dx = this.vx;
      let dy = this.vy;
      let x = (this.tailX[0] += dx);
      let y = (this.tailY[0] += dy);
      let speed = Math.sqrt(dx * dx + dy * dy);
      const count = speed * 10;
      const k1 = -5 - speed / 3;

      if (x <= 0 || x > this.width) this.vx *= -1;
      if (y <= 0 || y > this.height) this.vy *= -1;

      this.vx *= 1 - this.viscosity;
      this.vy *= 1 - this.viscosity;

      let mid = `M${this.tailX[0]},${this.tailY[0]}`;
      let tail = `M${this.tailX[0]},${this.tailY[0]}`;
      for (let i = 1; i < 12; ++i) {
        const vx = x - this.tailX[i];
        const vy = y - this.tailY[i];
        const k2 = Math.sin(((this.count += count) + i * 3) / 300) / speed;
        this.tailX[i] = (x += (dx / speed) * k1) - dy * k2;
        this.tailY[i] = (y += (dy / speed) * k1) + dx * k2;
        speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
        const cell = `L${this.tailX[i]},${this.tailY[i]}`;
        if (i < 4) {
          mid += cell;
        }
        tail += cell;
      }
      this.head = `translate(${this.tailX[0]}, ${
        this.tailY[0]
      })rotate(${Math.atan2(this.vy, this.vx) * degrees})`;
      this.mid = mid;
      this.tail = tail;
    },
    draw() {
      this.head = this.foreign.head;
      this.mid = this.foreign.mid;
      this.tail = this.foreign.tail;
    }
  }
};
</script>

<style>

.mid {
  stroke-width: 4px;
  fill: none;
  stroke-linecap: round;
}
.tail {
  stroke-width: 2px;
  fill: none;
  stroke-linecap: round;
}
</style>
