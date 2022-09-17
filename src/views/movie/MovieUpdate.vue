<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改电影</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="电影封面" prop="cover">
            <!-- 头像 -->
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8888/upload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image
                v-if="form.cover"
                :src="form.cover"
                class="avatar"
                fit="contain"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="电影类别" prop="category_id">
            <el-radio-group v-model="form.category_id">
              <el-radio :label="1">热映</el-radio>
              <el-radio :label="2">待映</el-radio>
              <el-radio :label="3">经典</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电影名称" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="电影类型" prop="type">
            <el-select
              multiple
              v-model="form.type"
              placeholder="请选择电影类型"
            >
              <el-option
                v-for="item in movieTypes"
                :key="item.id"
                :label="item.typename"
                :value="item.typename"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电影主演" prop="star_actor">
            <el-select
              v-model="form.star_actor"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入主演名称"
              :remote-method="loadActorByName"
              :loading="loadingActors"
            >
              <el-option
                v-for="item in actorlist"
                :key="item.id"
                :label="item.actor_name"
                :value="item.actor_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上映时间" prop="showingon">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.showingon"
              value-format="yyyy-MM-dd"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="电影评分" prop="score">
            <el-input v-model="form.score"></el-input>
          </el-form-item>
          <el-form-item label="电影时长" prop="duration">
            <el-input v-model="form.duration"></el-input>
          </el-form-item>
          <el-form-item label="电影简介" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即更新</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
      actorlist: "", //模糊查询结果
      loadingActors: false,
      movieTypes: null,
      form: {
        id: this.$route.params.id,
        cover: "",
        category_id: 1,
        title: "",
        type: "",
        star_actor: "",
        showingon: "",
        score: "",
        duration: "",
        description: "",
      },
      rules: {
        cover: [{ required: true, message: "请选择封面图片", trigger: "blur" }],
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        type: [{ required: true, message: "请填写电影类型", trigger: "blur" }],
        starActor: [
          { required: true, message: "请填写电影主演", trigger: "blur" },
        ],
        showingon: [
          { required: true, message: "请选择上映时间", trigger: "blur" },
        ],
        score: [{ required: true, message: "请填写评分", trigger: "blur" }],
        duration: [
          { required: true, message: "请填写电影时长", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请填写电影简介", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
   
    onSubmit() {
      this.form.type = this.form.type.join("/");
      this.form.star_actor = this.form.star_actor.join("/");
      console.log(this.form.type);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log("submit!", this.form);
          this.http.MovieApi.update(this.form).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("更新成功");
              this.$router.push("/home/movie-list");
            }
            console.log("添加电影", res);
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },
    // 回显图片
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        // 将返回回来的图片地址，赋值给cover
        this.form.cover = res.data;
      }
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    loadAllMovieTypes() {
      this.http.MovieApi.listAllMovieType().then((res) => {
        console.log("所有的电影类型", res);
        if (res.data.code === 200) {
          this.movieTypes = res.data.data;
        }
      });
    },
    // 通过名称模糊查询演员列表
    loadActorByName(query) {
      this.loadingActors = true;
      this.http.ActorApi.listByName({ name: query }).then((res) => {
        console.log("模糊查询结果", res);
        this.actorlist = res.data.data;
        this.loadingActors = false;
      });
    },
    loadMovieInfo() {
      this.http.MovieApi.queryById({ id: this.form.id }).then((res) => {
        console.log("通过id加载电影信息", res);
        this.form = res.data.data;
        // 需要重新整理数据
        this.form.star_actor = this.form.star_actor.split("/");
        this.form.type = this.form.type.split("/");
      });
    },
  },
  mounted() {
    // 加载所有的电影类型
    this.loadAllMovieTypes();
    // 加载当前电影的详情信息，回填表单
    this.loadMovieInfo();
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>