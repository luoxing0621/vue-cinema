<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}
.scroll-container::-webkit-scrollbar {
  width: 6px;
}
.scroll-container::-webkit-scrollbar-track {
  background: #efefef;
  border-radius: 2px;
  width: 6px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
  width: 6px;
  border-radius: 3px;
}
</style>
