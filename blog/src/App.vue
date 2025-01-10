<template>

  <div class="container">

    <RouterView></RouterView>

  </div>

</template>
<script setup>

import { onMounted } from 'vue';
import router from './routers/router';
import axiosInstance from './functions/axios';
function checkLogin() {
  const token = localStorage.getItem("jwt")
  axiosInstance.post("/user/verifyToken", null, {
    headers: {
      token: token
    }
  }).then(res => {
    if(res.status == 401){
      console.log("验证未通过");
      
      router.push('/loginPage')
    }

  }).catch(() => {
    router.push('/loginPage')
  })
}
onMounted(() => {
  checkLogin()
})

</script>
<style src="./assets/main.css"></style>
