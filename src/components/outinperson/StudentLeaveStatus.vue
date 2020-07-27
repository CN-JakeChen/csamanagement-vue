<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公寓人员出入管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生离校情况</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="已离校学生" name="first">
          <!-- 学生已离校列表区域 -->
          <el-table :data="StudentIsLeaveList" border stripe>
            <el-table-column label="姓名" prop="studentName"></el-table-column>
            <el-table-column label="学号" prop="studentNumber"></el-table-column>
            <el-table-column label="班级" prop="className"></el-table-column>
            <el-table-column label="楼栋" prop="buildNumber"></el-table-column>
            <el-table-column label="寝室号" prop="roomNumner"></el-table-column>
            <el-table-column label="床位" prop="bedNumber"></el-table-column>
          </el-table>

          <!-- 分页控件区 -->
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="queryInfo1.pagenum"
            :page-sizes="[1, 2, 3, 4]"
            :page-size="queryInfo1.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="未离校学生" name="second">
          <!-- 学生未离校列表区域 -->
          <el-table :data="StudentNotLeaveList" border stripe>
            <el-table-column label="姓名" prop="studentName"></el-table-column>
            <el-table-column label="学号" prop="studentNumber"></el-table-column>
            <el-table-column label="班级" prop="className"></el-table-column>
            <el-table-column label="楼栋" prop="buildNumber"></el-table-column>
            <el-table-column label="寝室号" prop="roomNumner"></el-table-column>
            <el-table-column label="床位" prop="bedNumber"></el-table-column>
          </el-table>

          <!-- 分页控件区 -->
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="queryInfo2.pagenum"
            :page-sizes="[1, 2, 3, 4]"
            :page-size="queryInfo2.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      queryInfo1: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 4
      },
      total1: 0,
      queryInfo2: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 4
      },
      total2: 0,
      activeName: 'first',
      StudentIsLeaveList: [],
      StudentNotLeaveList: []
    }
  },
  created() {
    this.getStudentIsLeaveList()
  },
  methods: {
    async getStudentIsLeaveList() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get(
        `studentLeaveRegistrations/1/${this.queryInfo1.pagenum}/${this.queryInfo1.pagesize}`
      )
      console.log(res)
      this.total1 = res.data.total
      this.StudentIsLeaveList = res.data.pageData
      setTimeout(() => {
        loading.close()
      }, 800)
    },
    async getStudentNotLeaveList() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get(
        `studentLeaveRegistrations/0/${this.queryInfo2.pagenum}/${this.queryInfo2.pagesize}`
      )
      console.log(res)
      this.total2 = res.data.total
      this.StudentNotLeaveList = res.data.pageData
      setTimeout(() => {
        loading.close()
      }, 800)
    },
    handleClick() {
      if (this.activeName === 'first') {
        this.getStudentIsLeaveList()
      } else {
        this.getStudentNotLeaveList()
      }
    },
    // 当页面数量发生改变时触发该方法
    handleSizeChange1(newSize) {
      this.queryInfo1.pagesize = newSize
      this.getStudentIsLeaveList()
    },
    // 当页数发生改变时触发该方法
    handleCurrentChange1(newPage) {
      this.queryInfo1.pagenum = newPage
      this.getStudentIsLeaveList()
    },
    // 当页面数量发生改变时触发该方法
    handleSizeChange2(newSize) {
      this.queryInfo2.pagesize = newSize
      this.getStudentNotLeaveList()
    },
    // 当页数发生改变时触发该方法
    handleCurrentChange2(newPage) {
      this.queryInfo2.pagenum = newPage
      this.getStudentNotLeaveList()
    }
  }
}
</script>
