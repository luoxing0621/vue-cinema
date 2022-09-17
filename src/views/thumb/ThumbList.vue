<template>
  <div>
    <!-- 演员列表页面 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
      <el-breadcrumb-item>剧照列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 列表页面 -->
    <el-divider content-position="left">剧照列表</el-divider>
    <div v-if="thumbList">
      <div
      class="thumb-item"
        v-for="item in thumbList"
        :key="item.id"
      >
        <el-image
          style="
            width: 160px;
            height: 120px;
            box-shadow: #0003 5px 5px 5px 0px;
            margin: 10px 20px 0 0;
          "
          :src="item.url"
          fit="cover"
        >
        </el-image>
         <i class="el-icon-error" @click="deleteThumb(item.id)"></i>
      </div>

      <!-- <el-image
        style="
          width: 160px;
          height: 120px;
          box-shadow: #0003 5px 5px 5px 0px;
          margin-right: 20px;
        "
        src="/xxx.jpg"
        :fit="cover"
      ></el-image> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      movie_id: this.$route.params.movie_id,
      thumbList: null, //绑定剧照列表
    };
  },
  methods: {
    deleteThumb(id){
      this.http.movieThumbApi.delete({id}).then(res=>{
        console.log('删除剧照',res);
        if(res.data.code==200){
          this.loadThumbsByMovieId()
        }
      })
    },
    loadThumbsByMovieId() {
      this.http.movieThumbApi
        .listByMovieId({ movie_id: this.movie_id })
        .then((res) => {
          console.log("通过电影ID,查询剧照列表", res);
          this.thumbList = res.data.data;
        });
    },
  },

  mounted() {
    this.loadThumbsByMovieId();
  },
};
</script>
<style scoped>
.thumb-item{
  display: inline-block;
  position: relative;
}
.thumb-item i{
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 1.3em;
  display: none;
}
.thumb-item:hover i{
  display: block;
}
</style>

