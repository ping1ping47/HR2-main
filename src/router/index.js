import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/components/Dashboard/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Dashboard,
    },
    {
      path: "/Exam",
      component: () => import("../components/Exam/Exam.vue"),
    },
    {
      path: "/Examresults",
      component: () => import("../components/ExamResults/ExamResults.vue"),
    },
    {
      path: "/Post",
      component: () => import("../components/Post/Post.vue"),
    },
    {
      path: "/Interview",
      component: () => import("@/components/Interview/Interview.vue"),
    },
    {
      path: "/Employee",
      component: () => import("@/components/Employee/Employee.vue"),
    },
    {
      path: "/Test",
      component: () => import("@/components/Dashboard/Test.vue"),
    },
  ],
});

export default router;
