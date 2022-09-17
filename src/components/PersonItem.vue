<template>
  <div class="actor-item">
    <el-avatar shape="square" :size="70" fit="cover" :src="avatar"></el-avatar>
    <i class="el-icon-error" @click="deleteActor"></i>
    <div>{{ name }}</div>
  </div>
</template>

<script>
export default {
  props: ["id", "name", "avatar"],
  methods: {
    deleteActor() {
      // 通知父组件，演员删除成功 主动触发父组件中监听delect事件
      this.$emit("delect");
    },
  },
};
</script>

<style  scoped>
.actor-item {
  display: inline-block;
  margin: 20px 20px 0px 0px;
  text-align: center;
  position: relative;
}
.actor-item:hover i {
  display: block;
}
.actor-item i {
  position: absolute;
  font-size: 1.2em;
  top: -6px;
  right: -6px;
  display: none;
}
.actor-item div {
  font-size: 0.9em;
}
.el-avatar >>> img {
  width: 100%;
}
</style>