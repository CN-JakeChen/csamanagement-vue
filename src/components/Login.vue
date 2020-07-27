<template>
  <div class="login_container">
     <div class="login_system_name">
      <img src="../assets/logo_header.png" alt="">  <span>学生公寓信息管理系统</span>
      </div>
    <div class="login_box">
      <!-- 头像区域 -->
      <!-- <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>-->

      <div class="login_header">
        <h1>登录</h1>
      </div>

      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-suo"></el-input>
        </el-form-item>
        <div class="left_content">
          <el-link type="primary" @click="gotoForgetPW">忘记密码？</el-link>
        </div>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    restLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // // 增加这个为了springboot后台能接收到参数
      // const params = new URLSearchParams()
      // params.append('username', this.loginForm.username)
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)

        if (res.meta.status === 1000) return this.$message.error(res.meta.msg)

        if (res.meta.status === 1001) return this.$message.error(res.meta.msg)

        this.$message.success(res.meta.msg)

        // 保存token到sessionstorage
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('refreshToken', res.data.refreshToken)
        window.sessionStorage.setItem('username', this.loginForm.username)
        // 跳转到主页
        this.$router.push('/index')
      })
    },
    gotoForgetPW() {
      // console.log('到达')
      this.$alert('请联系系统管理员重置密码，联系电话：xxxxxxx', '忘记密码？')
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: whitesmoke;
  background-image: url(../assets/login_bg.jpg);
  background-size: 100% 100%;
  height: 100%;
}

@media screen and (min-width: 992px) {
  .login_box {
    width: 450px;
    height: 300px;
    position: absolute;
    background-color: white;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

@media screen and (max-width: 991px) {
  .login_box {
    width: 80%;
    height: 300px;
    position: absolute;
    background-color: white;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.login_header {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0%);
}
.login_system_name{
 position: absolute;
  left: 50%;
  transform: translate(-50%, 100px);
  color: #409eff;
  font-size: 35px;
  display: flex;
  align-items: center;
  img{
    width: 40px;
    margin-right: 10px;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.left_content {
  display: flex;
  float: left;
  justify-content: flex-start;
}
</style>
