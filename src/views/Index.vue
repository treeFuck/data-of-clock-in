<style>
#map {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  min-width: 1080px;
}
.con {
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
.left .import-file,
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
.left .import-file:hover,
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
.left .search {
  display: inline-block;
  margin: 0 0.8em;
  width: 20em;
  height: 2.5em;
  line-height: 2.6em;
  cursor: pointer;
  text-align: center;
}
.left .search .input {
  box-shadow: 2px 2px 5px #666;
}
.right {
  position: absolute;
  top: 1em;
  right: 1em;
}
.right .date-select .input {
  width: 430px;
  box-shadow: 2px 2px 5px #666;
}
.right .stu-list {
  position: absolute;
  top: 10vh;
  right: 0;
}
.right .stu-list .stu {
  margin: 2em 0;
  width: 430px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #666;
}
.right .stu-list .stu .top {
  padding: 0.5em 1em;
  color: #fff;
  text-align: left;
  background: #7ba4fb;
}
.right .stu-list .stu .top .name{
  display: block;
  font-size: 18px;
}
.right .stu-list .stu .top .stu-id{
  display: block;
  font-size: 15px;
}
.right .stu-list .stu .transfer-info {
  background: #fff;
}
.right .stu-list .stu .transfer-info div{
  display: flex;
  justify-content: space-between;
  margin: 0 1em;
  padding: 0 1em;
  height: 2.5em;
  line-height: 3em;
  background: #fff;
  border-bottom: 1px solid #666;
}
</style>
<template>
  <div class="index">
    <div id="map"></div>
    <div class="con">
      <div class="left">
        <div class="import-file">导入数据</div>
        <div class="clock-in">打卡动态</div>
        <div class="transfer-list" v-show="pattern==1">迁移列表</div>
        <div class="heatmap-show" v-show="pattern==0">
          <div class="see" v-show="heatmapSee" @click="heatmapSee=false"></div>
          <div class="no-see" v-show="!heatmapSee" @click="heatmapSee=true"></div>
        </div>
        <div class="search" v-show="pattern==1">
          <Input class="input" search placeholder="Enter something..." v-model="searchStr" />
        </div>
      </div>
      <div class="right">
        <div class="date-select">
          <DatePicker
            class="input"
            v-model="dateSelect"
            type="daterange"
            placement="bottom-end"
            placeholder="Select date"
          ></DatePicker>
        </div>
        <div class="stu-list" ref="stuList">
          <div class="stu">
            <div class="top">
              <span class="name">蔡徐坤</span>
              <span class="stu-id">3118004971</span>
            </div>
            <div class="transfer-info">
              <div>
                <span>2020-2-1</span>
                <span>广州</span>
              </div>
              <div>
                <span>2020-2-1</span>
                <span>广州</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      pattern: -1, // 0-->热力图， 1-->飞线图，-1-->待选
      searchStr: "",
      dateSelect: [],
      loading: false,

      heatmap: null,
      heatmapSee: false,

      lineArr: null,
      selectLineIndex: -1
    };
  },
  methods: {
    // 初始
    init() {
      this.map = new AMap.Map("map", {
        zoom: 12,
        center: [113.39, 23.05]
      });
      this.map.plugin([
        "AMap.Heatmap",
        "AMap.ElasticMarker",
        "AMap.DistrictSearch",
        "AMap.PolyEditor"
      ]);
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
    },
    // 获取热力图
    getHeatmap() {},
    // 删除热力图
    delHeatmap() {},
    // 获取全部飞线
    getAllLine() {
      this.loading = true;
      setTimeout(() => {
        // 模拟请求
        let dataArr = [
          [
            [113.31, 23.05],
            [113.39, 23.05]
          ],
          [
            [113.49, 23.05],
            [113.39, 23.05]
          ],
          [
            [113.31, 23.05],
            [113.39, 23.05]
          ],
          [
            [113.16, 23.8],
            [113.39, 23.05]
          ],
          [
            [112.99, 23.8],
            [113.39, 23.05]
          ],
          [
            [113.76, 22.99],
            [113.39, 23.05]
          ]
        ];
        this.lineArr = [];
        for (let i = 0; i < dataArr.length; i++) {
          let polyline = new AMap.Polyline({
            path: dataArr[i],
            isOutline: true,
            outlineColor: "#fff",
            borderWeight: 2,
            strokeColor: "#000",
            strokeWeight: 4,
            geodesic: true,
            cursor: "pointer"
          });
          polyline.setMap(this.map);
          // polyline.data = dataArr[i]
          polyline.data = {
            index: i,
            from: dataArr[i][0],
            to: dataArr[i][1],
            name: "张三" + i
          };
          // 线的点击事件
          polyline.on("click", event => {
            let polyline = event.target;
            this.selectLineIndex = polyline.data.index;
            this.getStuOfLine(polyline.data.from, polyline.data.to);
          });
          // 缩放地图到合适的视野级别
          this.lineArr.push(polyline);
        }
        this.loading = false;
        this.map.setFitView();
      }, 1000);
    },
    // 删除飞线
    delAllLine() {
      if (!this.lineArr) {
        return;
      }
      this.map.remove(this.lineArr);
    },
    // 根据飞线获取对应迁移学生列表
    getStuOfLine(from, to) {

      setTimeout(() => {
        let data = [
          {
            name: "张三",
            stuId: "3118004333",
            data: [
              {
                where: "北京",
                start: "2020-4-1",
                end: "2020-4-5"
              },
              {
                where: "广州",
                start: "2020-4-5",
                end: "2020-4-9"
              }
            ]
          },
          {
            name: "李四",
            stuId: "3118004444",
            data: [
              {
                where: "北京",
                start: "2020-4-1",
                end: "2020-4-5"
              },
              {
                where: "广州",
                start: "2020-4-5",
                end: "2020-4-9"
              }
            ]
          }
        ];
        let len = data.length;
        let str = '';
        for(let i = 0; i < len; i++) {
          str += this.getStuHtml(data[i]);
        }
        this.$refs.stuList.innerHTML = str;
      }, 1000);
    },
    // 获取右侧显示迁移学生信息节点的html字符串
    getStuHtml(data) {
      let len  = data.data.length;
      let transferInfoStr = '';
      for(let i = 0; i < len; i++) {
        transferInfoStr += `<div><span>${data.data[i].start} to ${data.data[i].end}</span><span>${data.data[i].where}</span></div>`;
      }
      let str =  `<div class="stu">
          <div class="top">
            <span class="name">${data.name}</span>
            <span class="stu-id">${data.stuId}</span>
          </div>
          <div class="transfer-info">
            ${transferInfoStr}
          </div>
        </div>`
      return str;
    },
    // 模糊搜索
    searchStu() {},
    // 搜索结果点击
    clickStu() {},
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
    searchStr(newVl, oldVl) {
      //普通的watch监听
      if (!oldVl || oldVl == newVl) {
        return;
      }
      console.log("searchStr: ", newVl, oldVl);
    },
    dateSelect: {
      //深度监听，可监听到对象、数组的变化
      handler(newVl, oldVl) {
        if (!oldVl) {
          return;
        }
        if (newVl[0] == "") {
          this.pattern = -1;
          this.delAllLine();
        } else if (this.handleTime(newVl[0]) == this.handleTime(newVl[1])) {
          this.pattern = 0;
          this.delAllLine();
        } else {
          this.pattern = 1;
          this.getAllLine();
        }
      },
      deep: true //true 深度监听
    },
    selectLineIndex(newVl, oldVl) {
      //普通的watch监听
      if (oldVl != -1) {
        this.lineArr[oldVl].setOptions({
          outlineColor: "#fff",
          borderWeight: 2
        });
      }
      this.lineArr[newVl].setOptions({
        outlineColor: "#f40",
        borderWeight: 3
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
