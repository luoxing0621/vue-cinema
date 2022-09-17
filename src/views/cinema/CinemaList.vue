<template>
  <div>
    <!-- 电影院列表页面 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <div
      id="cinemaListMapContainer"
      style="width: 100%; height: 230px; border: 1px solid #aaa"
    ></div>
    <!-- 列表页面 -->
    <el-divider content-position="left">电影院列表</el-divider>

    <el-table :data="tableData" style="width: 100%; height: 300">
      <el-table-column prop="cinema_name" label="影院名称" width="250" sortable>
      </el-table-column>
      <el-table-column prop="address" label="影院地址"> </el-table-column>
      <el-table-column
        align="left"
        label="影院位置"
        sortable
        :sort-method="sortByLocation"
      >
        <template slot-scope="scope">
          {{ scope.row.city }}{{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template scope="scope">
          <el-button
            type="warning"
            icon="el-icon-location-information"
            circle
            title="查看位置"
            @click="showLocation(scope.row.longitude, scope.row.latitude)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-folder-opened"
            circle
            title="查看影院放映厅列表"
            @click="$router.push(`/home/cinema-room-list/${scope.row.id}`)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-edit"
            circle
            title="修改电影院信息"
            @click="$router.push(`/home/cinema-update/${scope.row.id}`)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            title="删除电影院"
            @click="showDeleteDialog(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import httpApis from "@/http/index.js";
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  data() {
    return {
      tableData: [],
      map: null, //地图对象
    };
  },
  methods: {
    // 弹出删除对话框
    showDeleteDialog(id) {
      this.$confirm(
        "此操作将会永久关闭该影院，已有影院排期将会作废，是否确定删除该影院",
        "注意"
      )
        .then((res) => {
          return this.http.CinemaApi.delete({ id });
        })
        .then((res) => {
          console.log("删除成功", res);
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.loadAllCinema();
          }
        });
    },
    // 显示影院位置
    showLocation(lng, lat) {
      if (this.map != null) {
        this.map.setCenter([lng, lat], false, 1000);
        this.map.setZoom(20, false, 1000);
      }
    },
    // 针对定位进行排序
    sortByLocation(a, b) {
      let astr = a.city + b.district;
      let bstr = b.city + b.district;
      return astr > bstr;
    },
    // 加载所有电影院数据
    loadAllCinema() {
      this.http.CinemaApi.list().then((res) => {
        console.log("所有电影院数据", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
    // 初始化地图
    initMap() {
      AMapLoader.load({
        key: "	7f5475689f4e5afcddc904eb59f88d10", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [],
      })
        .then((AMap) => {
          this.map = new AMap.Map("cinemaListMapContainer", {
            zoom: 11,
            center: [116.481181, 39.989792],
            viewMode: "3D",
          });
          console.log("加载地图完成");
          // 将所有的电影院的位置，在地图中以marker的方式显示
          this.tableData.forEach((item) => {
            let lat = item.latitude;
            let lng = item.longitude;
            // chuangjianmarker，加marker加载到地图
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
            });
            this.map.add(marker);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    // 加载所有电影院数据
    this.loadAllCinema();
    // 初始化地图
    this.initMap();
  },
};
</script>

<style lang="scss" >
</style>