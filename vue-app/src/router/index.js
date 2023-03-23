import Router from "vue-router";
import Vue from "vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/upload",
      name: "uploadimg",
      component: () => import("../views/upload/UploadImg.vue"),
    },
    {
      path: "/images",
      name: "manageimg",
      component: () => import("../views/manage/ManageImg.vue"),
    },
  ],
});

export default router;
