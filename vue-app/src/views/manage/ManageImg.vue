<template>
  <div class="manage">
    <h2 align="center">管理图片页面</h2>
    <div class="table_container">
      <el-table
        class="form_table"
        :data="imagesList"
        row-key="id"
        style="width: 100%"
        stripe
      >
        <el-table-column label="序号" width="70" type="index"></el-table-column>
        <el-table-column label="图片" width="700" prop="url">
          <template slot-scope="scope">
            <img
              :src="scope.row.url"
              @click="showLargeImg(scope.row, scope.$index)"
              style="width: 700px"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="passImg(scope.row.id)"
              >通过</el-button
            >
            <el-button
              type="info"
              icon="el-icon-edit"
              size="mini"
              @click="rejectImg(scope.row.id)"
              >拒绝</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteImg(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-star-off"
              size="mini"
              @click="topImg(scope.row, scope.$index)"
              >置顶</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <viewer :images="imagesList" :options="options" ref="viewer"></viewer> -->
      <!-- //图片预览 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="80%">
        <div class="dialog-div">
          <div class="dialog-up">
            <!-- 左箭头 -->
            <a href="javascript:" @click="prevImg" class="left"
              ><img src="../../assets/prev.png" />
            </a>
            <img :src="currentImg.url" alt="" class="previewImg" />
            <!-- 右箭头 -->
            <a href="javascript:" @click="nextImg" class="right"
              ><img src="../../assets/next.png" />
            </a>
          </div>
          <div class="dialog-down">
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="passImg(currentImg.id)"
              >通过
            </el-button>
            <el-button
              type="info"
              icon="el-icon-edit"
              size="mini"
              @click="rejectImg(currentImg.id)"
              >拒绝</el-button
            >
          </div>
        </div>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginations.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="paginations.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import "viewerjs/dist/viewer.css";
export default {
  components: {},
  data() {
    return {
      //展示的图片列表
      imagesList: [],
      //分页参数
      paginations: {
        //当前页
        pagenum: 1,
        //一页显示图片数
        pagesize: 5,
      },
      //v-viewer选项
      options: {
        toolbar: {
          prev: true, // 显示上一张图片按钮
          next: true, // 显示下一张图片按钮
        },
      },
      //总图片数
      total: 0,
      //图片预览
      previewVisible: false,
      currentImg: [],
      currentIndex: 0,
    };
  },
  created() {
    this.getImagesList();
  },
  mounted() {
    this.rowDrop();
  },
  methods: {
    //获取图片列表
    async getImagesList() {
      const res = await this.$axios.get("/images/getImgs", {
        params: this.paginations,
      });
      if (res.status !== 200) {
        return this.$message.error("获取图片列表失败");
      }
      this.$message.success("获取图片列表成功");
      this.imagesList = res.data.data;
      this.total = res.data.total;
      console.log(this.imagesList);
    },
    //通过图片
    async passImg(id) {
      const res = await this.$axios.put(`/images/pass/${id}`);
      if (res.status !== 200) {
        return this.$message.error("通过图片操作失败");
      }
      this.$message.success("通过图片操作成功");
    },
    //拒绝图片
    async rejectImg(id) {
      const res = await this.$axios.put(`/images/reject/${id}`);
      if (res.status !== 200) {
        return this.$message.error("拒绝图片操作失败");
      }
      this.$message.success("拒绝图片操作成功");
    },
    //删除图片
    async deleteImg(id) {
      const res = await this.$axios.delete(`/images/delete/${id}`);
      if (res.status !== 200) {
        return this.$message.error("删除图片操作失败");
      }
      this.$message.success("删除图片操作成功");
      //重新获取图片列表
      this.getImagesList();
    },
    //置顶图片
    // async topImg(id) {
    //   console.log(id);
    //   const res = await this.$axios.put(`/images/top/${id}`, { top: 1 });
    //   if (res.status !== 200) {
    //     return this.$message.error("置顶图片操作失败");
    //   }
    //   this.$message.success("置顶图片操作成功");
    //   //重新获取图片列表
    //   this.getImagesList();
    // },
    //置顶图片
    topImg(row, index) {
      this.imagesList.splice(index, 1);
      this.imagesList.unshift(row);
      console.log(this.imagesList);
    },
    //展示一页数据条数变化
    handleSizeChange(newSize) {
      this.paginations.pagesize = newSize;
      this.getImagesList();
    },
    //页码变化
    handleCurrentChange(newPage) {
      this.paginations.pagenum = newPage;
      this.getImagesList();
    },
    // //弹窗显示图片
    showLargeImg(img, index) {
      //显示对话框
      this.previewVisible = true;
      this.currentImg = img;
      this.currentIndex = index;
    },
    //上一张图片
    prevImg() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      console.log(this.currentIndex);
      console.log(this.currentImg);
      // console.log()
      this.currentImg = this.imagesList[this.currentIndex];
    },
    //下一张图片
    nextImg() {
      console.log(this.currentIndex);
      if (this.currentIndex < this.paginations.pagesize - 1) {
        this.currentIndex++;
      }
      this.currentImg = this.imagesList[this.currentIndex];
    },
    //行拖拽排序
    rowDrop() {
      this.$nextTick(() => {
        this.sortable1 = Sortable.create(
          document.querySelector(".form_table .el-table__body-wrapper tbody"),
          {
            onEnd: ({ newIndex, oldIndex }) => {
              this.imagesList.splice(
                newIndex,
                0,
                this.imagesList.splice(oldIndex, 1)[0]
              );
              const newArray = this.imagesList.slice(0);
              this.imagesList = [];
              this.$nextTick(function () {
                this.imagesList = newArray;
              });
            },
          }
        );
      });
    },
  },
};
</script>

<style scoped>
.title {
  align-content: center;
}
.enlarge {
  max-width: 80%;
  max-height: 80%;
}
.dialog-div {
  height: 60vh;
}
.dialog-up {
  height: 90%;
}
.dialog-down {
  text-align: center;
  height: 10%;
}
.previewImg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: auto;
  height: 70%;
  transform: translate(-50%, -50%);
}

.left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}

.right {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
