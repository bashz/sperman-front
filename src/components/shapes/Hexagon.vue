<template>
  <path
    :fill="fill"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :d="d"
  />
</template>

<script>
export default {
  name: 'Hexagon',
  props: {
    // Style
    stroke: {
      type: String,
      default: '#757575'
    },
    fill: {
      type: String,
      default: '#757575'
    },
    strokeWidth: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      d: 'M1.732,15 L12.124,9 Q13.856,8 13.856,6 L13.856,-6 Q13.856,-8 12.124,-9 L1.732,-15 Q0,-16 -1.732,-15 L-12.124,-9 Q-13.856,-8 -13.856,-6 L-13.856,6 Q-13.856,8 -12.124,9 L-1.732,15 Q0,16 1.732,15 Z'
    }
  }
}
</script>

<style>
</style>
