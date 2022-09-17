<template>
  <div>
    <!-- 演员列表页面 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="电影名称">
        <el-input
          v-model="searchForm.movieName"
          placeholder="请输入电影名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表页面 -->
    <el-divider content-position="left">电影列表</el-divider>
    <!-- 使用表格呈现数据 -->
    <div v-if="tableData">
      <el-table :data="tableData.result" style="width: 100%">
        <el-table-column align="center" prop="cover" label="封面" width="180">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 80px"
              :src="scope.row.cover"
              fit="cover"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" align="center" label="标题">
        </el-table-column>
        <el-table-column prop="star_actor" align="center" label="主演">
        </el-table-column>
        <el-table-column
          prop="showingon"
          align="center"
          label="上映时间"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="duration"
          align="center"
          label="时长"
          width="180"
        >
          <template slot-scope="scope"> {{ scope.row.duration }}分钟 </template>
        </el-table-column>
        <el-table-column prop="category_id" align="center" label="所属类别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.category_id == 1" type="danger"
              >热映</el-tag
            >
            <el-tag v-if="scope.row.category_id == 2">待映</el-tag>
            <el-tag v-if="scope.row.category_id == 3" type="success"
              >经典</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <el-button
              type="info"
              icon="el-icon-user"
              circle
              title="配置演员列表"
              @click="showEditActorDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-picture"
              circle
              title="配置剧照列表"
              @click="showEditThumbDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-edit"
              circle
              title="修改演员信息"
              @click="$router.push(`/home/movie-update/${scope.row.id}`)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              title="删除演员"
              @click="deleteMovie(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="changeCurrentPage"
        style="margin: 20px 0; text-align: right"
        background
        layout="prev, pager, next"
        :total="tableData.total"
        :page-size="tableData.pagesize"
      >
      </el-pagination>
    </div>
    <!-- 修改剧照弹窗 -->
    <el-dialog title="配置剧照图片" :visible.sync="dialogThumbVisible">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="http://localhost:8888/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :on-success="handleSuccess"
        :auto-upload="false"
        multiple
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="warning"
          @click="$router.push('/home/thumb-list/' + currentSelectedId)"
          >管理剧照图片</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
    <!--配置演员列表窗口  -->
    <el-dialog title="配置演员列表" :visible.sync="dialogEditActorsVisible">
      <el-transfer
        :titles="['未选择演员', '已选择演员']"
        v-model="transferValue"
        :data="transferData"
        style="text-align: center"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitActors()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import httpApis from "@/http/index.js";
export default {
  data() {
    return {
      transferValue: [], //原始数据
      transferData: [], //选中项
      dialogEditActorsVisible: false, //是否显示修改演员列表
      currentSelectedId: "", //选择的电影id
      fileList: [], //上传文件列表
      dialogThumbVisible: false, //图片弹窗设置
      searchForm: {
        movieName: "", //绑定电影名字
      },
      tableData: null, //存储表格所需要的数据 {page,pagesize,total,result}
    };
  },
  methods: {
    showEditActorDialog(id) {
      this.dialogEditActorsVisible = true;
      this.currentSelectedId = id;
      // 发送请求，获取当前电影下的所有演员
      this.http.MovieApi.listByMovieId({ movie_id: id }).then((res) => {
        console.log("当前电影下的所有演员", res);
        if (res.data.code == 200) {
          this.transferValue = [];
          res.data.data.forEach((item) => {
            this.transferValue.push(item.actor_id);
          });
        }
      });
    },
    // 提交穿梭框收集的数据
    submitActors() {
      let movie_id = this.currentSelectedId;
      let actor_ids = this.transferValue.toString();
      this.http.MovieApi.bindActors({ movie_id, actor_ids }).then((res) => {
        console.log("为电影绑定演员列表", res);
        if (res.data.code == 200) {
          this.$message.success("演员列表绑定完成");
          this.dialogEditActorsVisible = false;
        }
      });
    },
    // 处理图片上传成功后
    handleSuccess(res) {
      console.log(res);
      let url = res.data;
      let movie_id = this.currentSelectedId;
      // 发请求新增剧照配置
      this.http.movieThumbApi.add({ url, movie_id }).then((res) => {
        console.log("上传剧照结果", res);
      });
    },
    // 修改弹窗false---true
    showEditThumbDialog(id) {
      this.dialogThumbVisible = true;
      this.currentSelectedId = id;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 修改当前页
    changeCurrentPage(val) {
      console.log(val);
      let name=this.searchForm.movieName.trim()
      if(!name){
        // name为空
        this.http.MovieApi.list({ page: val, pagesize: 2 }).then((res) => {
        console.log("加载所有电影列表", res);
        this.tableData = res.data.data;
         });
        }else{
                 this.http.MovieApi.listByName({ name, page: val, pagesize: 2 }).then(
          (res) => {
            console.log("模糊查询电影列表", res);
            if (res.data.code == 200){
              this.tableData = res.data.data;
            }
          }
        );
      } 
    },
    deleteMovie(id) {
      this.http.MovieApi.delete({ id }).then((res) => {
        console.log("删除电影", res);
        if (res.data.code == 200) {
          this.loadMovieList();
        }
      });
    },
    // 当点击搜索按钮时，发送请求
    onSearch() {
      let name = this.searchForm.movieName.trim();
      if (!name) {
        //name为空
        this.loadMovieList();
      } else {
        this.http.MovieApi.listByName({ name, page: 1, pagesize: 2 }).then(
          (res) => {
            console.log("模糊查询电影列表", res);
            if (res.data.code == 200){
              this.tableData = res.data.data;
            }
          }
        );
      }
    },
    // 加载电影列表
    loadMovieList() {
      this.http.MovieApi.list({ page: 1, pagesize: 3 }).then((res) => {
        console.log("加载所有电影列表", res);
        this.tableData = res.data.data;
      });
    },
    loadAllActors() {
      this.http.ActorApi.list({ page: 1, pagesize: 100 }).then((res) => {
        console.log("加载所有演员", res);
        // 将res.data.data中的数据保存到this.transferData
        // res.data.data现有的数据结构:[{演员},{演员}...]
        // this.transferData需要的数据结构 [{key:1,label:'},...]
        let mdata = [];
        res.data.data.forEach((item) => {
          mdata.push({
            key: item.id,
            label: item.actor_name,
          });
        });
        this.transferData = mdata;
      });
    },
  },
  mounted() {
    // 加载所有电影列表
    this.loadMovieList();
    // 加载所有演员
    this.loadAllActors();
  },
};
</script>

<style lang="scss" >
.actor-item {
  display: inline-block;
  margin: 20px 20px 0 0;
  text-align: center;
  div {
    font-size: 0.9em;
  }
}
.el-transfer-panel {
  text-align: left;
}
</style>