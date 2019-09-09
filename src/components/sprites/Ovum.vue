<template>
  <g :transform="transform">
    <defs>
      <radialGradient :id="defId" cx="50%" cy="50%" :r="gradientRadiusPercent" fx="50%" fy="50%">
        <stop offset="0%" :style="{'stop-color': fertalizationColor}" />
        <stop :offset="fertalizatinPercent" :style="{'stop-color': fertalizationColor}" />
        <stop offset="100%" :style="{'stop-color': color}" />
      </radialGradient>
    </defs>
    <path :fill="defUrl" :d="d" :stroke="stroke" />
  </g>
</template>

<script>
import store from "../store";
export default {
  name: "Ovum",
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
    // Ovum's initial position
    originX: {
      type: Number,
      default: 400
    },
    originY: {
      type: Number,
      default: 300
    },
    // Ovum's motion
    originVX: {
      type: Number,
      default: 0
    },
    originVY: {
      type: Number,
      default: 0
    },
    vr: {
      type: Number,
      default: 0
    },
    // Ovum's size
    scale: {
      type: Number,
      default: 1
    },
    radius: {
      type: Number,
      default: 25
    },
    // Ovum's colors
    color: {
      type: String,
      default: "#e568e4"
    },
    fertalizationColor: {
      type: String,
      default: "#ee2864"
    },
    // Ovum's shape
    d: {
      type: String,
      default: ""
    },
    // The number of actual frame
    frame: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      x: this.originX,
      y: this.originY,
      vx: this.originVX,
      vy: this.originVY,
      percent: 0,
      angle: 0
    };
  },
  mounted() {
    this.$store.dispatch("ovumCreated", {
      id: this.id,
      x: this.x,
      y: this.y,
      scale: this.scale,
      radius: this.radius
    });
  },
  methods: {
    swim() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= this.left || this.x > this.right) this.vx *= -1;
      if (this.y <= this.top || this.y > this.bottom) this.vy *= -1;
      this.angle += this.vr;
      this.$store.dispatch("ovumMoved", {
        id: this.id,
        x: this.x,
        y: this.y
      });
    }
  },
  watch: {
    frame() {
      if (!this.isFertelized) {
        this.swim();
        const percent = this.percent + this.$store.state.ovums[this.id].progress;
        this.percent = percent > 0 ? (percent < 100 ? percent : 100) : 0;
      }
    },
    isFertelized() {
      this.$store.dispatch("ovumFertelized", this.id);
    }
  },
  computed: {
    transform() {
      return `translate(${this.x}, ${this.y})rotate(${this.angle})scale(${this.scale})`;
    },
    defId() {
      return `fertilization-${this.id}`;
    },
    defUrl() {
      return `url(#fertilization-${this.id})`;
    },
    fertalizatinPercent() {
      return `${this.percent}%`;
    },
    gradientRadiusPercent() {
      return `${(this.percent / 2) || 1}%`;
    },
    isFertelized() {
      return this.percent === 100;
    },
    stroke() {
      return this.isFertelized ? "#44ff66" : "none";
    },
    top() {
      return this.radius
    },
    left() {
      return this.radius
    },
    bottom() {
      return this.height - this.radius
    },
    right() {
      return this.width - this.radius
    }
  }
};
</script>

<style>
</style>
