<template>
  <g :transform="transform">
    <path class="germ" :d="d" />
  </g>
</template>

<script>
import store from "../store";
export default {
  name: "Germ",
  store,
  props: {
    id: {
      type: Number,
      default: 0
    },
    // Game dimensions
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    // Satrting side
    startOn: {
      type: String,
      default: "top"
    },
    // Germ's speed
    speedMin: {
      type: Number,
      default: 0
    },
    speedRange: {
      type: Number,
      default: 1
    },
    vr: {
      type: Number,
      default: 0
    },
    // Germ's size
    scale: {
      type: Number,
      default: 1
    },
    radius: {
      type: Number,
      default: 15
    },
    // Germ's shape
    d: {
      type: String,
      default: ""
    },
    // Germ's cycle for appearing
    spawnCycle: {
      type: Number,
      default: 500
    },
    spawnAt: {
      type: Number,
      default: 50
    },
    // The number of actual frame
    frame: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      x: -10,
      y: -10,
      vx: 0,
      vy: 0,
      angle: 0,
      initialFrame: this.frame
    };
  },
  methods: {
    spawn() {
      const speed = Math.random() * this.speedRange + this.speedMin;
      let min = 0;
      let max = 0;
      if (this.startOn === "top") {
        this.y = -20;
        this.x = Math.random() * (this.width / 2) + this.width / 4;
        this.vy = speed;
        min = this.x / (this.height / speed);
        max = (this.width - this.x) / (this.height / speed);
        this.vx = Math.random() * (max + min) - min;
      } else if (this.startOn === "bot") {
        this.y = this.height + 20;
        this.x = Math.random() * (this.width / 2) + this.width / 4;
        this.vy = -speed;
        min = this.x / (this.height / speed);
        max = (this.width - this.x) / (this.height / speed);
        this.vx = Math.random() * (max + min) - min;
      } else if (this.startOn === "left") {
        this.y = Math.random() * (this.height / 2) + this.height / 4;
        this.x = -20;
        this.vx = speed;
        min = this.y / (this.width / speed);
        max = (this.height - this.y) / (this.width / speed);
        this.vy = Math.random() * (max + min) - min;
      } else {
        this.y = Math.random() * (this.height / 2) + this.height / 4;
        this.x = this.width + 20;
        this.vx = -speed;
        min = this.y / (this.width / speed);
        max = (this.height - this.y) / (this.width / speed);
        this.vy = 0 * (max + min) - min;
      }
    },
    swim() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.vr;
    }
  },
  watch: {
    frame(frame) {
      if ((frame - this.initialFrame) % this.spawnCycle === this.spawnAt) {
        this.spawn();
      } else {
        this.swim();
        this.$store.dispatch("germMoved", {
          x: this.x,
          y: this.y,
          scale: this.scale,
          radius: this.radius
        });
      }
    }
  },
  computed: {
    transform() {
      return `translate(${this.x}, ${this.y})rotate(${this.angle})scale(${this.scale})`;
    }
  }
};
</script>

<style>
.germ {
  fill: #c0f541;
}
</style>
