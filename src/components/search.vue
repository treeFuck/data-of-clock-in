<style scoped>
.search {
  position: relative;
  display: inline-block;
  margin: 0 0.8em;
  width: 20em;
  height: 2.5em;
  line-height: 2.6em;
  cursor: pointer;
  text-align: center;
}
.search .input {
  box-shadow: 2px 2px 5px #666;
}
.search .result-list {
  position: absolute;
  top: 4em;
  left: 0;
  width: 20em;
  max-height: 21em;
  overflow-y: auto;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px 1px #999;
}
.search .result-list .load {
  height: 5em;
}
.search .result-list .no-result {
  text-align: center;
}
.search .result-list .result {
  display: flex;
  justify-content: space-between;
  padding: 0 1em;
  margin: 0 1em;
  border-bottom: 1px solid #999;
}
.search .result-list .name {
  font-size: 16px;
}
.search .result-list .stu-id {
  font-size: 14px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
<template>
  <div class="search">
    <Input
      class="input"
      search
      placeholder="输入姓名 / 学号"
      v-model="searchStr"
      clearable
      @on-focus="onFocus"
      @on-blur="onBlur"
    />
    <div class="result-list" v-show="searchStr&&focus">
      <div class="load" v-show="loading">
        <Spin fix>
          <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
          <div>搜索中……</div>
        </Spin>
      </div>
      <div v-show="!resultList&&!loading" class="no-result">暂无搜索结果</div>
      <div class="result" v-for="(data, index) in resultList" :key="index" @click="clickStu(data)">
        <span class="name">{{data.studentName}}</span>
        <span class="stu-id">{{data.studentId}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "search",
  // props: {
  //   msg: String
  // },
  data() {
    return {
      searchStr: "",
      resultList: null,
      loading: false,
      focus: false
    };
  },
  methods: {
    onFocus() {
      this.focus= true;
    },
    onBlur() {
      setTimeout(()=>{
        this.focus= false;
      }, 100)
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
    },
    // 模糊搜索
    searchStu() {
      this.loading = true;
      let param = {
        startTime: this.handleTime(this.$store.state.dateSelect[0]),
        endTime: this.handleTime(this.$store.state.dateSelect[1]),
        keyword: this.searchStr
      };
      this.$axios
        .post(this.$store.state.reqUrl + "/api/student/migrate", param)
        .then(res => {
          console.log(res.data);
          this.loading = false;
          if (res.data.code == 1) {
            if (res.data.data.length == 0) {
              this.resultList = null;
            } else {
              this.resultList = res.data.data;
            }
          } else if (res.data.code == 3001) {
            this.$Modal.warning({
              title: "错误提示",
              content: res.data.message
            });
            this.$router.replace({ name: "login" });
          }
        })
        .catch(err => {
          this.resultList = null;
          this.loading = false;
          console.log(err);
        });
    },
    // 搜索结果点击
    clickStu(data) {
      this.$emit("clickStu", data);
      //this.markLine(data.studentName);
      this.markLine2(data.migrate);
      this.$emit("setMigrateLine");

      // this.searchStr = "";
      // if(this.resultList) {
      //   this.resultList = null;
      // }
    },
    // (polyLine版)给点击选择了的学生对应的迁移飞线标红
    markLine(studentName) {
      let lineArr = this.$store.state.lineArr;
      let len = lineArr.length;
      let indexArr = [];
      for (let i = 0; i < len; i++) {
        if (lineArr[i].data.studentName == studentName) {
          indexArr.push(i);
        }
      }
      console.log(indexArr);
      this.$store.state.selectLineIndex = indexArr;
    },
    // (飞线图版)给点击选择了的学生对应的迁移飞线标红
    markLine2(migrate) {
      let len = migrate.length;
      let lineArr = [];
      let effectScatterArr = [];
      for (let j = 0; j < len; j++) {
        let pathStart = [migrate[j].from.lng, migrate[j].from.lat];
        let pathEnd = [migrate[j].to.lng, migrate[j].to.lat];
        lineArr.push({
          coords: [pathStart, pathEnd],
          value: 1000
        });
        // effectScatterArr.push({
        //   value: pathEnd
        // });
      }
      this.$store.state.series[0].data = lineArr;
      // this.$store.state.series[1].data = lineArr;
      // this.$store.state.series[2].data = effectScatterArr;
    }
  },
  watch: {
    searchStr(newVl, oldVl) {
      if (newVl) {
        this.searchStu();
      } else {
        this.resultList = null;
      }
    }
  }
};
</script>


