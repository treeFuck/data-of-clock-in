<style scoped>
.transfer-stu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  overflow: hidden;
  background: #7ba4fb;
  box-shadow: 0 5px 10px 0 #999;
}
.title {
  position: relative;
  padding: 0 1em;
  height: 2.5em;
  color: #eee;
  line-height: 2.5em;
  font-size: 18px;
  text-align: left;
  letter-spacing: 0.2em;
  background: #344b7e;
}
.title img {
  position: absolute;
  right: 1em;
  top: 50%;
  height: 1em;
  cursor: pointer;
  transform: translateY(-50%);
}
.transfer-con {
  width: 55em;
  max-height: 40em;
  overflow-y: auto;
}
.transfer-con::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.transfer-con::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: #c8c5c5;
}
.transfer-con::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 2px;
  background: #eee;
  overflow: hidden;
}
.transfer-con .no-data {
    color: #fff;
    font-size: 16px;
    line-height: 2em;
    text-align: center;
}
.transfer-con .stu {
  width: 100%;
  overflow: hidden;
}
.transfer-con .stu .top {
  position: relative;
  padding: 0.5em 2em;
  text-align: left;
  background: #455e94;
  border-bottom: 0.5px solid #aaa;
}
.transfer-con .stu .top img {
  position: absolute;
  right: 2em;
  top: 50%;
  height: 1em;
  cursor: pointer;
  transform: translateY(-50%);
}
.transfer-con .stu .top span {
  display: inline-block;
  width: 8em;
  font-size: 16px;
}
.transfer-con .stu .transfer-info {
  padding: 0 1em;
  overflow: hidden;
  background: #5073bd;
  transition: height 0.5s;
}
.transfer-con .stu .transfer-info .noFirst {
  border-top: 1px solid #fff;
}
.transfer-con .stu .transfer-info .info {
  padding: 0.8em 2em;
  display: flex;
  justify-content: space-between;
}
.transfer-con .stu .transfer-info .info span {
  display: inline-block;
  height: 1em;
}
</style>
<template >
  <div class="transfer-stu">
    <div class="title">
        <span>迁移列表</span>
        <img @click="colse" src="../assets/cuo.png">
    </div>
    <div class="transfer-con">
      <!-- <div class="stu" v-for="(data, index1) in transferData" :key="index1">
        <div class="top">
          <span>{{data.studentId}}</span>
          <span>{{data.studentName}}</span>
          <img v-show="showIndex!=index1" src="../assets/xiala.png" @click="showIndex=index1">
          <img v-show="showIndex==index1" src="../assets/shouqi.png" @click="showIndex=-1">
        </div>
        <div :style="{'height':showIndex==index1?`${data.migrate.length*2.7}em`:0}" class="transfer-info">
          <div
            :class="{'noFirst':index2 != 0}"
            class="info"
            v-for="(tranferData, index2) in data.migrate"
            :key="index2"
          >
            <span>{{tranferData.from.time}} ~ {{tranferData.to.time}}</span>
            <span>{{tranferData.from.city}} ~ {{tranferData.to.city}}</span>
          </div>
        </div>
      </div>  -->
      <Menu class="transfer-con" theme="dark" width="55em">
          <div class="no-data" v-show="!transferData || transferData.length == 0">
              <span>暂无数据</span>
          </div>
        <Submenu class="stu" v-for="(data, index1) in transferData" :key="index1" :name="index1+1">
          <template class="top" slot="title">
            <span style="display: inline-block;width: 8em">{{data.studentId}}</span>
            <span style="display: inline-block;width: 8em">{{data.studentName}}</span>
          </template>
          <MenuItem
            style="display: flex;justify-content: space-between;"
            v-for="(tranferData, index2) in data.migrate"
            :key="index2"
            :name="`${index1+1}-${index2+1}`"
          >
            <span>{{tranferData.from.time}} ~ {{tranferData.to.time}}</span>
            <span>{{tranferData.from.city}} ~ {{tranferData.to.city}}</span>
          </MenuItem>
        </Submenu>
      </Menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "transferStu",
  props: {
    transferData: Array
  },
  data() {
    return {
      showIndex: 0
    };
  },
  methods: {
      colse() {
          this.$emit('closeTransferList');
      }
  }
};
</script>

