<template>
  <div class="main">
    <el-button type="primary" @click="goUpload">上传</el-button>
    <div class="waterfall">
      <div class="waterfall-item" v-for="item in imageList" :key="item.id">
        <img :src="item.url" @click="showLargeImg(item)" />
      </div>
      <!-- 加载中 -->
      <div v-if="loading" class="loading">loading...</div>
      <!-- //图片预览 -->
      <el-dialog title="图片预览" :visible.sync="previewVisible" width="80%">
        <div class="dialog-div">
          <!-- 左箭头 -->
          <a href="javascript:" @click="prevImg" class="left"
            ><img src="../../assets/prev.png" />
          </a>
          <div class="previewImg"><img :src="currentImg.url" alt="" /></div>
          <!-- 右箭头 -->
          <a href="javascript:" @click="nextImg" class="right"
            ><img src="../../assets/next.png" />
          </a>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageList: [],
      paginations: {
        //当前页
        pagenum: 1,
        //一页显示图片数
        pagesize: 10,
      },
      previewVisible: false,
      currentImg: "",
      currentIndex: 0,
      //加载时显示loading
      loading: false,
    };
  },
  created() {
    this.getImages();
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(this.setItemPosition, 1000);
    });
    //监听下拉加载事件
    window.addEventListener("scroll", this.scroll);
  },
  methods: {
    //跳转到图片上传页面
    goUpload() {
      this.$router.push("/upload");
    },

    //下拉加载更多
    scroll() {
      const windowHight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      if (windowHight >= scrollHeight - scrollTop) {
        this.loading = true;
        //下拉加载
        setTimeout(() => {
          this.getImages();
          this.setItemPosition();
          this.loading = false;
        }, 1000);
      }
    },

    //获取图片
    async getImages() {
      const res = await this.$axios.get("/images/getImgs", {
        params: this.paginations,
      });
      if (res.status !== 200) {
        return this.$message.error("获取图片列表失败");
      }
      const newData = res.data.data;
      this.imageList = [...this.imageList, ...newData];
      this.paginations.pagenum++;
      console.log("this.imageList", this.imageList);
    },

    //确定元素定位
    setItemPosition() {
      const waterfall = document.querySelector(".waterfall");
      const items = waterfall.querySelectorAll(".waterfall-item");
      console.log("items", items);
      const itemWidth = items[0].offsetWidth;
      const columnCount = 5; //列数
      const gap = 10;
      //列高
      let columnHeights = new Array(columnCount).fill(0);
      items.forEach((item) => {
        const minHeight = Math.min(...columnHeights);
        const minIndex = columnHeights.indexOf(minHeight);
        item.style.left = (itemWidth + gap) * minIndex + "px"; // 设置左偏移量
        item.style.top = minHeight + "px"; // 设置上偏移量
        columnHeights[minIndex] += item.offsetHeight + gap; // 更新当前最小高度的列的高度
      });
      waterfall.style.height = Math.max(...columnHeights) + "px";
    },

    //点击弹层显示
    showLargeImg(item) {
      this.previewVisible = true;
      this.currentImg = item;
      this.currentIndex = this.imageList.indexOf(item);
    },
    //切换上一张
    prevImg() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
      console.log(this.currentIndex);
      console.log(this.currentImg);
      this.currentImg = this.imageList[this.currentIndex];
    },
    //切换下一张
    nextImg() {
      console.log(this.currentIndex);
      if (this.currentIndex < this.imageList.length) {
        this.currentIndex++;
      }
      this.currentImg = this.imageList[this.currentIndex];
    },
  },
};
</script>

<style scoped>
/* * {
  margin: 0;
  padding: 0;
} */
.waterfall {
  position: relative;
  margin-top: 20px;
  width: 100%;
}
.loading {
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translate(-50%, 0);
}
.waterfall-item {
  position: absolute;
  width: 20%;
  border: 1px solid #fff;
  margin: 5px;
  overflow: hidden;
}
.waterfall-item img {
  width: 100%;
  height: auto;
}

.dialog-div {
  position: relative;
  height: 60vh;
}

.previewImg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 90%;
  height: 90%;
  transform: translate(-50%, -50%);
  border: 1px solid #fff;
}

.previewImg img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: 100%;
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
