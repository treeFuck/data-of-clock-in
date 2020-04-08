<style scoped>
.stu-list {
  position: absolute;
  top: 10vh;
  right: 0;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}
.stu-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.stu-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 2px;
  background: #7ba4fb;
}
.stu-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 5px;
  background: #fff;
}
.stu-list .stu {
  margin: 2em auto;
  width: 400px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #666;
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
  background: #fff;
}
.stu-list .stu .transfer-info div {
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
  <div class="stu-list">
      <div class="stu" v-for="(data, index1) in stuList" :key="index1">
          <div class="top">
            <span class="name">{{data.studentName}}</span>
            <span class="stu-id">{{data.studentId}}</span>
          </div>
          <div class="transfer-info">
            <div v-for="(tranferData, index2) in data.migrate" :key="index2">
                <span>{{tranferData.from.time}} to {{tranferData.to.time}}</span>
                <span>{{tranferData.from.city}} 至 {{tranferData.to.city}}</span>
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

