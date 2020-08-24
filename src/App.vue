<template>
  <div id="app">
      <hello-world button="btn"></hello-world>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld"
export default {
  name: 'App',
  components : {
    HelloWorld
  }
}
</script>

<style>
  #app{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
