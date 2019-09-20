<template>
  <div id="setting">
    <nav-bar />
    <h1 class="coming-soon">Coming Soon</h1>
  </div>
</template>

<script>
import NavBar from "./shapes/NavBar"
export default {
  name: "Setting",
  components: {
    NavBar
  }
};
</script>

<style>
.coming-soon {
  position: relative;
  top: 200px;
  margin: 0;
}
</style>
