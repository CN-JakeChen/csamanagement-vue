<template>
  <div class="wraper">
    <span class="welcome_header">欢迎使用学生公寓信息管理系统</span>
    <div class="bg"></div>
    <span style="color:darkgray;font-size:15px;margin-top:4px">Version 1.8</span>
  </div>
</template>

<style lang="less" scoped>
.wraper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@media only screen and (min-width: 768px) {
  .bg {
    width: 300px;
    height: 300px;
    background-image: url(../assets/welcome_bg.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .welcome_header {
    font-size: 40px;
  }
}
@media only screen and (max-width: 767px) {
  .bg {
    width: 100px;
    height: 100px;
    background-image: url(../assets/welcome_bg.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .welcome_header {
    font-size: 20px;
  }
}
</style>
