<template>
  <div id="game">
    <stages v-if="mode === 'solo'"/>
    <rooms v-if="mode === 'multi'"/>
    <setting v-if="mode === 'setting'"/>
    <home v-if="mode === 'menu'"/>
  </div>
</template>

<script>
import Home from './components/Home'
import Stages from './components/Stages'
import Rooms from './components/Rooms'
import Setting from './components/Setting'
export default {
  name: 'App',
  components: {
    Home,
    Stages,
    Rooms,
    Setting
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
