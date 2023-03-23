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
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <br />
    <el-button size="small" type="primary" @click="uploadImgs">提交</el-button>
    <!-- //预览 -->
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
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    //待优化
    handleSuccess(res, file) {
      this.fileList.push({
        name: file.name,
        url: res.url,
      });
    },
    //待优化
    handlePreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogVisible = true;
    },
    uploadImgs() {
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
          console.log(res);
          console.log("Images saved successfully");
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped></style>
