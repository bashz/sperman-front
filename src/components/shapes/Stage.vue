<template>
  <g :transform="transform" :style="style">
    <polygon
      :stroke-width="1"
      :stroke="level.isAvailable ? '#b6ffca' : fill"
      :fill="fill"
      :points="draw(hexagon)"
    />
    <text class="level-number" y="-4">{{level.level}}</text>
    <polygon v-if="level.isAvailable" fill="#b6ffca" :points="draw(rubbon)" :style="style" />
    <text v-if="level.isAvailable" class="level-score" y="10">{{level.score}}</text>
    <path
      v-if="!level.isAvailable"
      d="M 3,3.25 H 2.5 V 2.5 C 2.5,1.1215 1.3785001,0 1e-7,0 -1.3785,0 -2.5,1.1215 -2.5,2.5 V 3.25 H -3 c -0.13825,0 -0.25,0.112 -0.25,0.25 V 7.75 C -3.25,7.888 -3.13825,8 -3,8 H 3 C 3.13825,8 3.25,7.888 3.25,7.75 V 3.5 C 3.25,3.362 3.13825,3.25 3,3.25 Z M -2,2.5 c 0,-1.10275 0.89725,-2 2.0000001,-2 1.10275,0 2,0.89725 2,2 V 3.25 H -2 Z M 0.2500001,5.93075 V 6.25 c 0,0.138 -0.11175,0.25 -0.25,0.25 -0.13825,0 -0.25,-0.112 -0.25,-0.25 V 5.93075 C -0.39875,5.84425 -0.5,5.68475 -0.5,5.5 -0.5,5.22375 -0.27625,5 1e-7,5 c 0.27625,0 0.5,0.22375 0.5,0.5 0,0.1845 -0.10125,0.344 -0.25,0.43075 z"
    />
  </g>
</template>

<script>
export default {
  name: "Stage",
  props: {
    level: {
      type: Object,
      default() {
        return { isAvailable: false, level: 1, score: 0 };
      }
    }
  },
  data() {
    return {
      hexagon: [
        [0, 16],
        [13.856, 8],
        [13.856, -8],
        [0, -16],
        [-13.856, -8],
        [-13.856, 8],
        [0, 16]
      ],
      rubbon: [
        [-13.856, 4],
        [-13.856, 8],
        [0, 16],
        [13.856, 8],
        [13.856, 4],
        [-13.856, 4]
      ]
    };
  },
  methods: {
    draw(points) {
      return points.join(" ");
    }
  },
  computed: {
    transform() {
      return `translate(${90 +
        30 * (Math.floor((this.level.level - 1) / 10) % 2) +
        ((this.level.level - 1) % 10) * 60}, ${75 +
        Math.floor((this.level.level - 1) / 10) * 52})scale(2)`;
    },
    fill() {
      return this.level.isAvailable ? "#6c9448" : "#ffa13d";
    },
    style() {
      return { cursor: this.level.isAvailable ? "pointer" : "" };
    }
  }
};
</script>

<style>
.level-number {
  font-size: 8px;
}
.level-score {
  font-size: 5px;
}
</style>
