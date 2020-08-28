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
.theme-orange .vdatetime-popup__header,
.theme-orange .vdatetime-calendar__month__day--selected > span > span,
.theme-orange .vdatetime-calendar__month__day--selected:hover > span > span {
  background: #ff5800 !important;
}

.theme-orange .vdatetime-year-picker__item--selected,
.theme-orange .vdatetime-time-picker__item--selected,
.theme-orange .vdatetime-popup__actions__button {
  color: #ff5800 !important;
}
</style>
