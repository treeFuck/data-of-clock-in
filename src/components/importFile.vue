<style scoped>
.import-file {
  position: relative;
  display: inline-block;
  margin: 0 0.8em;
  width: 6em;
  height: 2.5em;
  line-height: 2.6em;
  text-align: center;
  color: #fff;
  overflow: hidden;
  border-radius: 5px;
  background: #7ba4fb;
  box-shadow: 2px 2px 5px #666;
}
.import-file input {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  opacity: 0;
}
.import-file:hover span {
  font-weight: bold;
  color: #000;
}
</style>

<template>
  <div class="import-file">
    <span>导入数据</span>
    <input type="file" @change="importFile" multiple="multiple" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  methods: {
    importFile() {
      let file = event.target.files;
      let len = file.length;
      let formdata = new window.FormData();
      for (let i = 0; i < len; i++) {
        let fileValue = file[i].name;
        if (this.judge(file[i].name) !== 'OK') {
          event.target.value = "";
          return;
        } else {
          formdata.append("file", file[i], file[i].name);
        }
      }
      console.log(formdata.getAll("file"));
      event.target.value = "";
      this.$store.state.loading=true;
      $.ajax({
        url: this.$store.state.reqUrl + "/api/student/import",
        method: "POST",
        data: formdata,
        contentType: false,
        processData: false,
        dataType: "json",
        async: true,
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: sessionStorage.getItem("authorization")
        },
        success: data => {
          if (data.code == 1) {
            this.$Modal.info({
              title: "上传成功",
              content: ""
            });
          } else if (data.code == 3001) {
            this.$Modal.warning({
              title: "错误提示",
              content: "请先登录"
            });
            this.$router.replace({ name: "login" });
          } else {
            this.$Modal.warning({
              title: "错误提示",
              content: data.message
            });
          }
          this.$store.state.loading=false;
        }
      });
    },
    judge(fileName) {
      let AllImgExt = ".xls|.xlsx|";
      var extName = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
      if (AllImgExt.indexOf(extName + "|") != -1) {
        return 'OK';
      }
      let ErrMsg =`该文件类型不允许上传。请上传${AllImgExt}类型的文件，当前上传的文件有${extName}类型`
      return this.$Modal.warning({
        title: "错误提示",
        content: ErrMsg
      });
    }
  }
};
</script>

