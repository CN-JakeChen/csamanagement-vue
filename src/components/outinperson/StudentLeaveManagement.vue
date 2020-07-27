<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公寓人员出入管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生离校登记管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请输入姓名" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 学生离校登记列表区域 -->
      <el-table :data="StudentLeaveList" border stripe>
        <el-table-column label="姓名" prop="studentName"></el-table-column>
        <el-table-column label="学号" prop="studentNumber"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
        <el-table-column label="楼栋" prop="buildNumber"></el-table-column>
        <el-table-column label="寝室号" prop="roomNumner"></el-table-column>
        <el-table-column label="床位" prop="bedNumber"></el-table-column>
        <el-table-column label="离校时间" prop="outTime"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 6
      },
      total: 0,
      StudentLeaveList: []
    }
  },
  created() {
    this.getStudentLeaveList()
  },
  methods: {
    async getStudentLeaveList() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get(
        `studentLeaveRegistrations/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      )
      console.log(res)
      res.data.pageData.forEach(element => {
        element.outTime = this.formatTime(element.outTime)
      })
      this.StudentLeaveList = res.data.pageData
      setTimeout(() => {
        loading.close()
      }, 800)
    },
    formatTime(input) {
      var d = new Date(input)
      var year = d.getFullYear()
      var month =
        d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1)
      var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
      var hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours()
      var minutes =
        d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()
      var seconds =
        d.getSeconds() < 10 ? '0' + d.getSeconds() : '' + d.getSeconds()
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minutes +
        ':' +
        seconds
      )
    }
  }
}
</script>
