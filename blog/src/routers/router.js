
import TestVue from "@/components/TestVue.vue"
import UserInfo from "@/components/user/UserInfo.vue"
import BlogPage from "@/components/blog/BlogPage.vue"
import {createRouter, createWebHashHistory } from "vue-router"
import BlogRecommend from "@/components/blog/BlogRecommend.vue"
import HomePage from "@/components/HomePage.vue"
import BarPage from "@/components/bar/BarPage.vue"
import LoginPage from "@/components/user/LoginPage.vue"
import RegisterPage from "@/components/user/RegisterPage.vue"
import CreateBarPage from "@/components/bar/CreateBarPage.vue"

import PrivateMessagePage from "@/components/message/PrivateMessagePage.vue"

import CommonMessagePage from "@/components/message/CommonMessagePage.vue"
import UserEdit from "@/components/user/UserEdit.vue"
import SearchPage from "@/components/search/SearchPage.vue"


const routes = [
    {
      path: '/blogPage/:blogId/:commentId?',
      component: BlogPage,
      props:true
    },
    {
      path:'/userInfo/:userId',
      component: UserInfo,
      props:true
    },
    {
      path:"/",
      redirect: '/homePage'
    },
    {
      path:"/blogRec",
      component:BlogRecommend
    },
    {
      path:"/testVue",
      component: TestVue
    },{
      path:'/homePage',
      component: HomePage
    },{
      path:'/barPage/:barId',
      component : BarPage,
      props:true
    },{
      path:'/loginPage',
      component: LoginPage
    },
    {
      path:'/registerPage',
      component:RegisterPage
    },
    {
      path:'/createBarPage',
      component:CreateBarPage
    },{
      path:'/privateMessagePage/:userId?/:userName?',
      component:PrivateMessagePage,
      props:true
    },{
      path:'/commonMessagePage/:index?',
      component:CommonMessagePage
    },{
      path:"/userEdit",
      component:UserEdit
    },{
      path:'/searchPage/:type/:query/:page',
      component: SearchPage,
      // props:true
    }
  ]
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })
  // router.beforeEach((to,from,next) =>{
  //   const token = localStorage.getItem("jwt")
  //   if((to.path !== "/loginPage" || to.path!=="/registerPage" ) && !token){
  //     next("/loginPage")
  //   }else{
  //     axios.post("http://localhost:8080/user/verifyToken",null,{
  //       headers:{
  //         token:token
  //       }
  //     }).then(res=>{
  //       if(res.status ===200){
  //         next();
  //       }else{
  //         next("/loginPage")
  //       }
  //     }).catch(()=>{
  //       next("/loginPage")
  //     })
  //   }
  // })
  export default router