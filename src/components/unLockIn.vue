<style scoped>
.unLockIn {
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
.unLockIn-con {
  width: 55em;
  max-height: 40em;
  overflow-y: auto;
}
.unLockIn-con::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.unLockIn-con::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: #c8c5c5;
}
.unLockIn-con::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 2px;
  background: #eee;
  overflow: hidden;
}
.unLockIn-con .no-data {
    color: #fff;
    font-size: 16px;
    line-height: 2em;
    text-align: center;
}
</style>

<template>
  <div class="unLockIn">
      <div class="title">
          <span>打卡动态</span>
          <img @click="colse" src="../assets/cuo.png">
        </div>
      <Menu class="unLockIn-con" theme="dark" width="55em">
          <div class="no-data" v-show="!unLockInArr || unLockInArr.length == 0">
              <span>暂无数据</span>
          </div>
        <Submenu class="stu" v-for="(data, index1) in unLockInArr" :key="index1" :name="index1+1">
          <template class="top" slot="title">
            <span style="display: inline-block;width: 8em">{{data.time}}</span>
            <span style="display: inline-block;width: 8em">{{data.students.length}}人未打卡</span>
          </template>
          <MenuItem
            style="display: flex;justify-content: space-between;"
            v-for="(stu, index2) in data.students"
            :key="index2"
            :name="`${index1+1}-${index2+1}`"
          >
            <span>{{stu.id}}</span>
            <span>{{stu.name}}</span>
          </MenuItem>
        </Submenu>
      </Menu>
  </div>
</template>

<script>
export default {
name: "unLockIn",
  props: {
    unLockInArr: Array
  },
  data() {
    return {
      showIndex: 0
    };
  },
  methods: {
      colse() {
          this.$emit('closeUnLockInArr');
      }
  }
}
</script>

