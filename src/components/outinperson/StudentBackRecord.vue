<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公寓人员出入管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生返校登记</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <div class="fdiv">
        <el-form :model="studentBackRegistration" label-width="80px">
          <el-form-item label="学号">
            <el-input
              v-model="studentBackRegistration.studentNumber"
              placeholder="请输入您的学号"
              @input="searchStuInfo(studentBackRegistration.studentNumber)"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="stuInfo.studentName"></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="stuInfo.className"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" @click="registerStudentInfo">确认登记</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stuInfo: {
        studentName: '',
        className: ''
      },
      studentBackRegistration: {
        id: 0,
        studentNumber: '',
        inDate: ''
      }
    }
  },
  created() {},
  methods: {
    async searchStuInfo(stuId) {
      console.log(stuId)
      const { data: res } = await this.$http.get(`students/${stuId}`)
      console.log(res)
      if (res.data !== null) {
        this.stuInfo = res.data
      } else {
        this.stuInfo = {
          studentName: '',
          className: ''
        }
      }
    },
    async registerStudentInfo() {
      console.log(this.studentBackRegistration.studentNumber)
      console.log(this.studentBackRegistration.inDate)
      const { data: res } = await this.$http.post(
        'studentBackRegistration/',
        this.studentBackRegistration
      )
      console.log(res)
      if (res.meta.status === 900) {
        return this.$message.error(res.meta.msg)
      }
      if (res.meta.status !== 200) {
        return this.$message.error('登记失败')
      }
      this.open()
      this.clearInfo()
    },
    open() {
      this.$alert('登记成功', '提示', {
        confirmButtonText: '确定'
      })
    },
    clearInfo() {
      this.stuInfo = {
        studentName: '',
        className: ''
      }
      this.studentBackRegistration = {
        id: 0,
        studentNumber: '',
        inDate: ''
      }
    }
  }
}
</script>
