
import UserInfo from "@/components/user/UserInfo.vue"
import BlogPage from "@/components/blog/BlogPage.vue"
import {createRouter, createWebHashHistory, createWebHistory } from "vue-router"
import LoginPage from "@/components/user/LoginPage.vue"
import RegisterPage from "@/components/user/RegisterPage.vue"
import UserEdit from "@/components/user/UserEdit.vue"
import SearchPage from "@/components/search/SearchPage.vue"
import ClubPage from "@/components/bar/ClubPage.vue"
import CreateBlogPage from "@/components/blog/CreateBlogPage.vue"
import ClubRecommendPage from "@/components/bar/ClubRecommendPage.vue"
import BlogRecommendPage from "@/components/blog/BlogRecommendPage.vue"
import ClubCreatePage from "@/components/bar/ClubCreatePage.vue"
import HomePage from "@/components/HomePage.vue"
import NotificationPage from "@/components/message/NotificationPage.vue"
import UserCollectPage from "@/components/user/UserCollectPage.vue"
import AdminTest from "@/components/admin/adminTest.vue"
const routes = [
  {
    path: '/home',
    component: HomePage,
    children: [
      {
        path: 'blogPage/:blogId/:commentId?', 
        component: BlogPage,
        props: true
      },
      {
        path: 'userInfo/:userId',
        component: UserInfo,
        props: true
      },
      {
        path: 'blogRecommendPage',
        component: BlogRecommendPage
      },
      {
        path: 'clubPage/:clubId',
        component: ClubPage,
        props: true
      },
      {
        path: 'clubCreatePage',
        component: ClubCreatePage
      },

      {
        path: 'edit',
        component: UserEdit
      },
      {
        path: 'search/:type/:query/:page',
        component: SearchPage,
        // props: true
      },
      {
        path: 'createBlogPage',
        component: CreateBlogPage
      },
      {
        path: 'clubRecommendPage',
        component: ClubRecommendPage
      },{
        path: 'notification/:type',
        component: NotificationPage
      },{
        path:'collect',
        component: UserCollectPage
      }
    ]
  },
  {
    path: '/login',
    name:"login",
    component: LoginPage
  },
  {
    path: '/register',
    name:"register",
    component: RegisterPage
  },
  {
    path:"/",
    redirect: "/home/blogRecommendPage"
  },
  {
    path:"/admin",
    component:AdminTest
  }
]



  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("jwt") ;
    const userId = localStorage.getItem("userId");  
    if (to.name === "login" || to.name === "register") {
      next();
      return; 
    } 
    if (token == null || userId == null) {
      next({ name: "login" });
    } else {
      next();
    }
  });
  export default router