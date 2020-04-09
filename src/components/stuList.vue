<style scoped>
.stu-list {
  position: absolute;
  top: 3em;
  right: 0;
  width: 100%;
  max-height: 32em;
  overflow-y: auto;
  box-shadow: 0 5px 5px 0 #999;
}
.stu-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  
}
.stu-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: #C8C5C5;
}
.stu-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 2px;
  background: #fff;
  overflow: hidden;
  border: 1px solid #7ba4fb;
}
.stu-list .stu {
  width: 100%;
  overflow: hidden;
}
.stu-list .stu .top {
  padding: 0.5em 1em;
  color: #fff;
  text-align: left;
  background: #7ba4fb;
}
.stu-list .stu .top .name {
  display: block;
  font-size: 18px;
}
.stu-list .stu .top .stu-id {
  display: block;
  font-size: 15px;
}
.stu-list .stu .transfer-info {
  padding: 0 1em;
  background: #fff;
}
.stu-list .stu .transfer-info .noFirst {
  border-top: 1px solid #ccc;
}
.stu-list .stu .transfer-info .info {
  padding: 0.5em 1em;
  display: flex;
  justify-content: space-between;
}
.stu-list .stu .transfer-info .info .time {
  text-align: left;
}
.stu-list .stu .transfer-info .info .city {
  text-align: right;
}
.stu-list .stu .transfer-info .info span {
  display: inline-block;
  height: 1em;
}
</style>

<template>
  <div class="stu-list">
      <div class="stu" v-for="(data, index1) in stuList" :key="index1">
          <div class="top">
            <span class="name">{{data.studentName}}</span>
            <span class="stu-id">{{data.studentId}}</span>
          </div>
          <div class="transfer-info">
            <div :class="{'noFirst':index2 != 0}" class="info" v-for="(tranferData, index2) in data.migrate" :key="index2">
                <div class="time">
                  <span>{{tranferData.from.time}}</span> 
                  <span>~{{tranferData.to.time}}</span>
                </div>
                <div class="city">
                  <span>{{tranferData.from.city}}</span>
                  <span>~{{tranferData.to.city}}</span>  
                </div>
                <!-- <span class="time">{{tranferData.from.time}} ~ {{tranferData.to.time}}</span>
                <span class="city">{{tranferData.from.city}} ~ {{tranferData.to.city}}</span> -->
            </div>
          </div>
        </div>
  </div>
</template>

<script>
export default {
    name: "stuList",
    props: {
        stuList: Array
    },
  data() {
    return {
    };
  },
  methods: {

  },
  watch: {
    //   stuList(nV,oV) {
    //       console.log(nV)
    //   }
  }
}
</script>

