<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增排片计划</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <p>
      为
      <span style="color: #409eff; font-weight: bold">{{
        cinemaRoomInfo.cinema_name
      }}</span>
      的
      <span style="color: #409eff; font-weight: bold"
        >{{ cinemaRoomInfo.cinema_room_name }}（{{
          cinemaRoomInfo.cinema_room_type
        }}）</span
      >
      添加排片计划
    </p>
    <el-divider></el-divider>

    <!-- 添加计划表单 -->
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="选择电影" prop="movie_id">
        <el-select
          ref="movieSelector"
          v-model="form.movie_id"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          style="width: 400px"
        >
          <el-option
            v-for="item in movieList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="放映日期" prop="showingon_date">
        <el-date-picker
          v-model="form.showingon_date"
          type="date"
          placeholder="选择日期"
          style="width: 190px"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
        &nbsp;
        <el-time-select
          v-model="form.showingon_time"
          :picker-options="{
            start: '00:00',
            step: '00:15',
            end: '24:00',
          }"
          placeholder="选择时间"
          style="width: 190px"
        >
        </el-time-select>
      </el-form-item>
      <el-form-item label="票价" prop="price">
        <el-input style="width: 400px" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="立即发布" prop="status">
        <el-switch
          v-model="form.status"
          active-value="1"
          inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即新增该计划</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        cinema_id: 0,
        cinema_room_id: this.$route.params.id,
        movie_id: "",
        price: 0,
        status: 0,
        showingon_date: "",
        showingon_time: "",
      },
      rules: {
        cinema_id: [
          { required: true, message: "请填写电影院ID", trigger: "blur" },
        ],
        cinema_room_id: [
          { required: true, message: "请填写放映厅ID", trigger: "blur" },
        ],
        movie_id: [
          { required: true, message: "请填写电影ID", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请填写价格", trigger: "blur" },
          {
            parttern: /\d+(.\d+)?/,
            message: "请填写正确的格式",
            trigger: "blur",
          },
        ],
        status: [
          { required: true, message: "请选择是否立即发布", trigger: "blur" },
        ],
        showingon_date: [
          { required: true, message: "请排片日期", trigger: "blur" },
        ],
        showingon_time: [
          { required: true, message: "请选择场次", trigger: "blur" },
        ],
      },

      cinemaRoomInfo: {}, // 存储当前放映厅基本信息

      loading: false, // 下拉框是否正在加载
      movieList: [], // 存储搜索得到的电影列表
    };
  },

  methods: {
    onSubmit() {
      this.form.cinema_id = this.cinemaRoomInfo.cinema_room_id;
      console.log(this.form);
      // 验证表单通过后，发送请求
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.http.ShowingonPlanApi.add(this.form).then((res) => {
            console.log("验证表单通过后，发送添加请求", res);
            // 获取电影名称
            let movie_name = this.$refs.movieSelector.selectedLabel;
            if (res.data.code == 200) {
              this.$notify({
                title: "添加排片计划成功",
                message: `${this.cinemaRoomInfo.cinema_name} 的 ${this.cinemaRoomInfo.cinema_room_name} 将会在${this.form.showingon_date} ${this.form.showingon_time}放映《${movie_name}》`,
                type: "success",
              });
              this.$router.go(-1);
            }
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },

    /**
     * 当输入了电影关键字后，执行
     */
    remoteMethod(query) {
      if (!query) {
        return;
      }
      // 模糊查询
      this.http.MovieApi.listByName({
        name: query,
        page: 1,
        pagesize: 20,
      }).then((res) => {
        console.log("输入了电影关键字后，模糊查询", res);
        this.movieList = res.data.data.result;
      });
    },
    /** 加载放映厅的基本信息*/
    loadCurrentCinemaRoom() {
      this.http.CinemaRoomApi.queryById({ id: this.form.cinema_room_id }).then(
        (res) => {
          console.log("加载放映厅的基本信息", res);
          if (res.data.code == 200) {
            this.cinemaRoomInfo = res.data.data;
          }
        }
      );
    },
  },
  mounted() {
    // 加载放映厅的基本信息
    this.loadCurrentCinemaRoom();
  },
};
</script>
