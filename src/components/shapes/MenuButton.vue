<template>
  <g class="menu-button" :transform="transform">
    <polygon :stroke-width="1" stroke="#b6ffca" fill="#b6ffca" :points="hexagon" />
    <text class="button-text" :x="positionText(text, 2)" y="-4">{{text}}</text>
    <path :d="icon" />
  </g>
</template>

<script>
export default {
  name: "MenuButton",
  props: {
    text: {
      type: String,
      default: "Restart"
    },
    icon: {
      type: String,
      default:
        "M 3,3.25 H 2.5 V 2.5 C 2.5,1.1215 1.3785001,0 1e-7,0 -1.3785,0 -2.5,1.1215 -2.5,2.5 Z"
    },
    position: {
      type: Object,
      default() {
        return { x: 0.5, y: 0.5 };
      }
    },
    height: {
      type: Number,
      default: 600
    },
    width: {
      type: Number,
      default: 800
    },
    angle: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hexagon: "0,16 13.856,8 13.856,-8 0,-16 -13.856,-8 -13.856,8 0,16"
    };
  },
  methods: {
    positionText(text, size) {
      return -("" + text).length * size;
    }
  },
  computed: {
    transform() {
      return `translate(${this.width * this.position.x}, ${this.height *
        this.position.y})rotate(${this.angle})scale(4)`;
    }
  }
};
</script>

<style>
.button-text {
  font-size: 6px;
}
.menu-button {
  cursor: pointer;
}
</style>
