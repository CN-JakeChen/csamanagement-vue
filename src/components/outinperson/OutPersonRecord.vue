<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公寓人员出入管理</el-breadcrumb-item>
      <el-breadcrumb-item>外来人员登记</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <div class="fdiv">
        <el-form :model="OutPersonInfoForm" label-width="80px">
          <el-form-item label="姓名">
            <el-input placeholder="请输入您的姓名" v-model="OutPersonInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input placeholder="请输入您的身份证号" v-model="OutPersonInfoForm.personId"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input placeholder="请输入您的联系电话" v-model="OutPersonInfoForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="来访原因">
            <el-input placeholder="请输入您的来访原因" v-model="OutPersonInfoForm.visitTheReason"></el-input>
          </el-form-item>
          <el-form-item label="离开时间">
            <el-time-picker
              v-model="OutPersonInfoForm.outDate"
              placeholder="请选择离开时间"
              :editable="false"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="来访楼栋">
            <el-select v-model="OutPersonInfoForm.visitBuild" placeholder="请选择">
              <el-option
                v-for="item in buildOptions"
                :key="item.buildNum"
                :label="item.buildNum"
                :value="item.buildNum"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="medium" @click="registerOutPersonInfo">确认登记</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      OutPersonInfoForm: {
        name: '',
        phone: '',
        personId: '',
        outDate: '',
        visitTheReason: '',
        visitBuild: ''
      },
      buildOptions: []
    }
  },
  created() {
    this.getBuildData()
  },
  methods: {
    async getBuildData() {
      const { data: res } = await this.$http.get('/builds')
      console.log(res.data)
      this.buildOptions = res.data
    },
    // 向后台发送外来人员登记信息
    async registerOutPersonInfo() {
      console.log(this.OutPersonInfoForm.name)
      console.log(this.OutPersonInfoForm.phone)
      console.log(this.OutPersonInfoForm.personId)
      console.log(this.OutPersonInfoForm.outDate)
      console.log(this.OutPersonInfoForm.visitTheReason)
      const { data: res } = await this.$http.post(
        'alienRegistrations/',
        this.OutPersonInfoForm
      )

      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('登记失败失败')
      }
      this.clearForm()
      return this.$message.success(res.meta.msg)
    },
    clearForm() {
      this.OutPersonInfoForm = {
        name: '',
        phone: '',
        personId: '',
        outDate: new Date(),
        visitTheReason: '',
        visitBuild: ''
      }
    }
  }
}
</script>
