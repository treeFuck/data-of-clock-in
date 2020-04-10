<style>
#map {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  min-width: 1080px;
}
.amap-marker-label {
  width: 60px;
  border: none;
  color: #fff;
  background: none;
  font-size: 15px;
  text-align: center;
}
.index .con {
  position: relative;
  min-width: 1080px;
}
.left {
  display: inline-flex;
  justify-content: flex-start;
  position: absolute;
  top: 1em;
  left: 0;
}
.left .transfer-list,
.left .clock-in {
  display: inline-block;
  margin: 0 0.8em;
  width: 6em;
  height: 2.5em;
  line-height: 2.6em;
  cursor: pointer;
  text-align: center;
  color: #fff;
  border-radius: 5px;
  background: #7ba4fb;
  box-shadow: 2px 2px 5px #666;
}
.left .transfer-list:hover,
.left .clock-in:hover {
  font-weight: bold;
  color: #000;
}
.left .heatmap-show div {
  display: inline-block;
  margin: 0 0.8em;
  width: 3em;
  height: 2.5em;
  border-radius: 5px;
  cursor: pointer;
  background-size: 2em auto;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #7ba4fb;
  box-shadow: 2px 2px 5px #666;
}
.left .heatmap-show .see {
  background-image: url(../assets/see.png);
}
.left .heatmap-show .no-see {
  background-image: url(../assets/no-see.png);
}
.right {
  position: absolute;
  top: 1em;
  right: 1em;
}
.right .date-select .input {
  width: 420px;
  box-shadow: 2px 2px 5px #666;
}
</style>
<template>
  <div class="index">
    <div id="map"></div>
    <div class="con">
      <div class="left">
        <!-- <div class="import-file">导入数据</div> -->
        <importFile></importFile>
        <div class="clock-in" @click="unLockInShow=true;transferlistShow=false">打卡动态</div>
        <div
          class="transfer-list"
          v-show="pattern==1"
          @click="transferlistShow=true;unLockInShow=false"
        >迁移列表</div>
        <div class="heatmap-show" v-show="pattern==0">
          <div class="see" v-show="heatmapSee" @click="heatmapSee=false"></div>
          <div class="no-see" v-show="!heatmapSee" @click="heatmapSee=true"></div>
        </div>
        <search ref="search" v-show="pattern==1" @clickStu="clickStu" @setMigrateLine="setMigrateLine"></search>
      </div>
      <div class="right">
        <div class="date-select">
          <DatePicker
            class="input"
            v-model="$store.state.dateSelect"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
            :options="options"
          ></DatePicker>
        </div>
        <stuList v-show="pattern==1" :stuList="stuListData"></stuList>
      </div>
      <transferStu
        @closeTransferList="closeTransferList"
        v-show="transferlistShow&&pattern==1"
        :transferData="transferData"
      ></transferStu>
      <unLockIn
        @closeUnLockInArr="closeUnLockInArr"
        v-show="unLockInShow"
        :unLockInArr="unLockInArr"
      ></unLockIn>
    </div>
  </div>
</template>

<script>
require("echarts-amap");
import search from "@/components/search.vue";
import stuList from "@/components/stuList.vue";
import transferStu from "@/components/transferStu.vue";
import unLockIn from "@/components/unLockIn.vue";
import importFile from "@/components/importFile.vue";
import markerIcon from "../assets/markerIcon.png";
export default {
  data() {
    return {
      myChart: null,
      map: null,
      layer: null,
      pattern: -1, // 0-->热力图， 1-->飞线图，-1-->待选
      loading: false, // loading界面
      heatmapSee: false, // 显示heatmap还是marker
      heatmapData: null, // 热力图数据（marker的数据）
      heatmap: null, // 热力图实例
      markerList: null, // marker实例数组
      stuListData: null, // 右侧学生信息列表
      transferData: null, // 全部迁移信息
      transferlistShow: false, // 迁移列表是否展示
      unLockInArr: null, // 打卡动态
      unLockInShow: false, // 打卡动态列表是否展示
      migrateLine: false, // 是否显示迁移飞线图
      options: {
        disabledDate(date) {
          let bool =
            date.valueOf() > Date.now() ||
            date.valueOf() < new Date("2020-1-1");
          return date && bool;
        }
      }
    };
  },
  methods: {
    // 初始
    init() {
      this.myChart = this.$echarts.init(document.getElementById("map"));
      this.myChart.setOption({
        amap: {
          zoom: 12,
          center: [113.39, 23.05],
          mapStyle: "amap://styles/whitesmoke", //地图主题，
        },
        animation: false,
        series: []
      });
      this.map = this.myChart
        .getModel()
        .getComponent("amap")
        .getAMap();
      this.layer = this.myChart
        .getModel()
        .getComponent("amap")
        .getLayer();
      
      this.layer.render = () => {
        if(!this.migrateLine) {
          return;
        }
        this.myChart.setOption({
          series: this.$store.state.series
        });
      };
      this.map.plugin(["AMap.Heatmap", "AMap.PolyEditor"]);
    },
    // 获取打卡动态
    getUnLockInArr() {
      this.loading = true;
      let param = {
        startTime: this.handleTime(this.$store.state.dateSelect[0]),
        endTime: this.handleTime(this.$store.state.dateSelect[1])
      };
      this.$axios
        .post(this.$store.state.reqUrl + "/api/student/clock", param)
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 1) {
            this.unLockInArr = res.data.data;
          } else if (res.data.code == 3001) {
            this.$Modal.warning({
              title: "错误提示",
              content: res.data.message
            });
            this.$router.replace({ name: "login" });
          } else {
            this.$Modal.warning({
              title: "错误提示",
              content: res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 获取热力图
    getHeatmapData() {
      this.loading = true;
      let date = this.handleTime(this.$store.state.dateSelect[0]);
      this.$axios
        .get(
          this.$store.state.reqUrl + "/api/student/heatMap" + `?time=${date}`
        )
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 1) {
            this.heatmapData = res.data.data;
            if (this.heatmapData.length == 0) {
              this.$Modal.info({
                title: "暂无数据",
                content: ""
              });
            }
            this.getMarkerList();
            if (this.heatmapSee) {
              this.showHeatmap();
            } else {
              this.showMarkerList();
            }
          } else if (res.data.code == 3001) {
            this.$Modal.warning({
              title: "错误提示",
              content: '请先登录'
            });
            this.$router.replace({ name: "login" });
          } else {
            this.$Modal.warning({
              title: "错误提示",
              content: res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 展示热力图
    showHeatmap() {
      if (!this.heatmap) {
        let option = {
          radius: 25,
          opacity: [0, 0.5],
          gradient: {
            0.5: "rgb(0, 0, 255)",
            0.65: "rgb(117, 211, 248)",
            0.7: "rgb(0, 255, 0)",
            0.9: "rgb(255, 234, 0)",
            1.0: "rgb(255, 0, 0)"
          }
        };
        this.heatmap = new AMap.Heatmap(this.map, option);
      }
      this.map.setZoomAndCenter(4, [116.2, 39.9]);
      this.heatmap.show();
      this.heatmap.setDataSet({ data: this.heatmapData });
    },
    // 隐藏热力图
    hideHeatmap() {
      if (!this.heatmap) {
        return;
      }
      this.heatmap.hide();
      this.heatmap.setDataSet({ data: null });
    },
    // 获取标记点
    getMarkerList() {
      this.markerList = [];
      let len = this.heatmapData.length;
      for (let i = 0; i < len; i++) {
        let lng = this.heatmapData[i].lng;
        let lat = this.heatmapData[i].lat;
        let startIcon = new AMap.Icon({
          size: new AMap.Size(60, 76),
          image: markerIcon,
          imageSize: new AMap.Size(60, 76)
        });
        let marker = new AMap.Marker({
          position: [lng, lat],
          icon: startIcon,
          offset: new AMap.Pixel(-30, -76)
        });
        marker.setLabel({
          offset: new AMap.Pixel(0, 16), //设置文本标注偏移量
          content: `${this.heatmapData[i].count}人`, //设置文本标注内容
          direction: "right" //设置文本标注方位
        });
        this.markerList.push(marker);
      }
    },
    // 显示标记点
    showMarkerList() {
      this.map.add(this.markerList);
      this.map.setFitView();
    },
    // 隐藏标记点
    hideMarkerList() {
      if (!this.markerList) {
        return;
      }
      this.map.remove(this.markerList);
    },
    // 获取全部飞线
    getAllLine() {
      this.loading = true;
      let param = {
        startTime: this.handleTime(this.$store.state.dateSelect[0]),
        endTime: this.handleTime(this.$store.state.dateSelect[1])
      };
      this.$axios
        .post(this.$store.state.reqUrl + "/api/student/migrate", param)
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 1) {
            this.transferData = res.data.data;
            if (this.transferData.length == 0) {
              this.$Modal.info({
                title: "暂无数据",
                content: ""
              });
            }
            this.drawLine(res.data.data);
          } else if (res.data.code == 3001) {
            this.$Modal.warning({
              title: "错误提示",
              content: "请先登录"
            });
            this.$router.replace({ name: "login" });
          } else {
            this.$Modal.warning({
              title: "错误提示",
              content: res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    drawLine(data) {
      this.$store.state.lineArr = [];
      let len1 = data.length;
      let index = 0;
      for (let i = 0; i < len1; i++) {
        let migrate = data[i].migrate;
        let len2 = migrate.length;
        for (let j = 0; j < len2; j++) {
          let pathStart = [migrate[j].from.lng, migrate[j].from.lat];
          let pathEnd = [migrate[j].to.lng, migrate[j].to.lat];
          let polyline = new AMap.Polyline({
            path: [pathStart, pathEnd],
            // isOutline: true,
            // outlineColor: "#fff",
            // borderWeight: 1,
            strokeColor: "#acca64",
            strokeWeight: 2,
            //geodesic: true,
            cursor: "pointer",
            lineCap: "round",
            zIndex: -100
          });
          polyline.data = {
            index: index++,
            from: pathStart,
            to: pathEnd,
            studentName: data[i].studentName
          };
          polyline.on("click", event => {
            let polyline = event.target;
            this.clearMigrateLine();
            this.$store.state.selectLineIndex = [polyline.data.index];
            this.getStuOfLine(polyline.data.from, polyline.data.to);
          });
          this.$store.state.lineArr.push(polyline);
        }
      }
      this.map.add(this.$store.state.lineArr);
      this.map.setFitView();
    },
    // 删除飞线
    delAllLine() {
      if (!this.$store.state.lineArr) {
        return;
      }
      this.map.remove(this.$store.state.lineArr);
    },
    // 根据飞线获取对应迁移学生列表
    getStuOfLine(from, to) {
      this.stuListData = null;
      console.log(from, to);
      this.loading = true;
      let param = {
        startTime: this.handleTime(this.$store.state.dateSelect[0]),
        endTime: this.handleTime(this.$store.state.dateSelect[1]),
        place: [
          {
            lng: from[0],
            lat: from[1]
          },
          {
            lng: to[0],
            lat: to[1]
          }
        ]
      };
      this.$axios
        .post(this.$store.state.reqUrl + "/api/student/migrate", param)
        .then(res => {
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 1) {
            this.stuListData = res.data.data;
          } else if (res.data.code == 3001) {
            this.$Modal.warning({
              title: "错误提示",
              content: '请先登录'
            });
            this.$router.replace({ name: "login" });
          } else {
            this.$Modal.warning({
              title: "错误提示",
              content: res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    // 搜索结果点击
    clickStu(data) {
      this.stuListData = [data];
    },
    // 显示迁徙图
    setMigrateLine() {
      this.migrateLine = true;
       this.layer.setzIndex(500);
      this.$store.state.selectLineIndex = [-1];
      this.myChart.setOption({
        series: this.$store.state.series
      });
    },
    // 清空迁徙图
    clearMigrateLine() {
      this.migrateLine = false;
       this.layer.setzIndex(0);
      this.myChart.setOption({
        series: null
      });
    },
    // 清空地图样式
    clearMap() {
      this.$refs.search.searchStr = "";
      this.stuListData = null;
      this.transferlistShow = false;
      this.delAllLine();
      this.hideHeatmap();
      this.hideMarkerList();
      this.clearMigrateLine();
    },
    closeTransferList() {
      this.transferlistShow = false;
    },
    closeUnLockInArr() {
      this.unLockInShow = false;
    },
    // 格式化时间
    handleTime(date) {
      if (!date) {
        return "";
      }
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      return `${year}-${month + 1}-${day} 00:00:00`;
    }
  },
  watch: {
    "$store.state.dateSelect": {
      handler(newVl, oldVl) {
        if (!oldVl || oldVl.length == 0) {
          return;
        }
        if (newVl[0] == "") {
          console.log("sadsdasda");
          this.pattern = -1;
          this.clearMap();
        } else if (this.handleTime(newVl[0]) == this.handleTime(newVl[1])) {
          this.pattern = 0;
          this.clearMap();
          this.getHeatmapData();
          this.getUnLockInArr();
        } else {
          this.pattern = 1;
          this.clearMap();
          this.getAllLine();
          this.getUnLockInArr();
        }
      },
      deep: true //true 深度监听
    },
    "$store.state.selectLineIndex": {
      handler(newVl, oldVl) {
        if (!newVl) {
          return;
        }
        if (oldVl) {
          let len2 = oldVl.length;
          for (let i = 0; i < len2; i++) {
            if(oldVl[i] < 0) {
              continue;
            }
            this.$store.state.lineArr[oldVl[i]].setOptions({
              strokeColor: "#acca64",
              zIndex: 1
            });
          }
        }
        let len1 = newVl.length;
        // console.log(newVl, oldVl);
        for (let i = 0; i < len1; i++) {
          if(newVl[i]<0) {
              continue;
            }
          this.$store.state.lineArr[newVl[i]].setOptions({
            strokeColor: "#f40",
            zIndex: 2
          });
        }
      },
      deep: true //true 深度监听
    },
    heatmapSee(newVl, oldVl) {
      if (this.pattern != 0) {
        return;
      }
      if (newVl) {
        this.hideMarkerList();
        this.showHeatmap();
      } else {
        this.hideHeatmap();
        this.showMarkerList();
      }
    }
  },
  mounted() {
    if (!sessionStorage.getItem("authorization")) {
      this.$Modal.warning({
        title: "错误提示",
        content: "请先登录"
      });
      this.$router.replace({ name: "login" });
    }
    this.init();
  },
  components: {
    search,
    stuList,
    transferStu,
    unLockIn,
    importFile,
  }
};
</script>
