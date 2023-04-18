<template>
  <div class="upload">
    <el-upload
      action="/upload"
      :on-success="handleSuccess"
      :on-change="handleChange"
      :limit="5"
      :file-list="fileList"
      list-type="picture"
      :auto-upload="false"
      v-loading.fullscreen.lock="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0,0,0,0.1)"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <br />
    <el-button size="small" type="primary" @click="uploadImgs">提交</el-button>
    <!--预览 -->
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImgUrl" alt="" style="width: 50%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      dialogImgUrl: "",
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleSuccess(res, file, fileList) {
      // this.fileList.push({
      //   name: file.name,
      //   url: res.url,
      // });
      this.fileList = fileList;
      this.loading = false;
    },
    //待优化
    handlePreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogVisible = true;
    },
    uploadImgs() {
      this.loading = true;
      let formData = new FormData();
      // console.log("fileList:", this.fileList);
      this.fileList.forEach((file) => {
        // console.log("file", file);
        formData.append("files", file.raw);
      });
      this.$axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          //上传成功
          console.log(res);
          console.log("Images saved successfully");
          this.$confirm("是否继续上传?", "提示", {
            confirmButtonText: "继续上传",
            cancelButtonText: "返回列表页",
            type: "warning",
          })
            .then(() => {
              this.fileList = [];
              this.loading = false;
            })
            .catch(() => {
              this.$router.push("/images");
            });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped></style>
