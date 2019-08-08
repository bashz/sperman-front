<template>
  <div id="game">
    <solo v-if="mode === 'solo'"/>
    <multi v-if="mode === 'multi'"/>
    <home v-if="mode === 'menu'"/>
  </div>
</template>

<script>
import Home from './components/Home'
import Solo from './components/Solo'
import Multi from './components/Multi'
export default {
  name: 'App',
  components: {
    Home,
    Solo,
    Multi
  },
  data () {
    return {
      mode: 'solo'
    }
  }
}
</script>

<style>
#game {
  height: 600px;
}
</style>
