<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公寓人员出入管理</el-breadcrumb-item>
      <el-breadcrumb-item>外来人员登记管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="请输入姓名"
            class="input-with-select"
            clearable
            v-model="queryInfo.query"
            @clear="getAlienRegistrationList"
          >
            <el-button slot="append" icon="el-icon-search" @click="queryOutPersonInfo"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 外来人员登记列表区域 -->
      <el-table :data="outPersonList" border stripe>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="身份证号" prop="personId"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="来访原因" prop="visitTheReason"></el-table-column>
        <el-table-column label="进入时间" prop="entryDate"></el-table-column>
        <el-table-column label="离开时间" prop="outDate"></el-table-column>
        <el-table-column label="访问楼栋" prop="visitBuild"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="openEditInfoDialog(scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="editForm.personId"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="进入时间">
          <el-time-picker v-model="editForm.entryDate" placeholder="请选择离开时间" :editable="false"></el-time-picker>
        </el-form-item>
        <el-form-item label="离开时间">
          <el-time-picker v-model="editForm.outDate" placeholder="请选择离开时间" :editable="false"></el-time-picker>
        </el-form-item>
        <el-form-item label="来访原因">
          <el-input v-model="editForm.visitTheReason"></el-input>
        </el-form-item>
        <el-form-item label="访问楼栋">
          <el-input v-model="editForm.visitBuild"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfo">确 定</el-button>
      </span>
    </el-dialog>
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
        pagesize: 4
      },
      total: 0,
      outPersonList: [],
      editDialogVisible: false,
      editForm: {
        id: 0,
        name: '',
        personId: '',
        phone: '',
        entryDate: new Date(),
        outDate: new Date(),
        visitTheReason: '',
        visitBuild: ''
      }
    }
  },
  created() {
    this.getAlienRegistrationList()
  },
  methods: {
    async getAlienRegistrationList() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get(
        `alienRegistrations/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取外来人员登记列表失败')
      }

      res.data.pageData.forEach(element => {
        element.entryDate = this.formatTime(element.entryDate)
        element.outDate = this.formatTime(element.outDate)
      })
      this.total = res.data.total
      this.outPersonList = res.data.pageData
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
    },
    // 当页面数量发生改变时触发该方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getAlienRegistrationList()
    },
    // 当页数发生改变时触发该方法
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getAlienRegistrationList()
    },
    editDialogClosed() {},
    openEditInfoDialog(row) {
      this.editForm = {
        id: row.id,
        name: row.name,
        personId: row.personId,
        phone: row.phone,
        entryDate: row.entryDate,
        outDate: row.outDate,
        visitTheReason: row.visitTheReason,
        visitBuild: row.visitBuild
      }

      this.editDialogVisible = true
    },
    async editInfo() {
      this.editForm.entryDate = new Date(this.editForm.entryDate)
      this.editForm.outDate = new Date(this.editForm.outDate)
      const { data: res } = await this.$http.put(
        'alienRegistrations/',
        this.editForm
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取外来人员登记列表失败')
      }
      this.getAlienRegistrationList()
      this.editDialogVisible = false
    },
    async queryOutPersonInfo() {
      const { data: res } = await this.$http.get(
        `alienRegistrations/${this.queryInfo.query}/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取外来人员登记列表失败')
      }

      res.data.pageData.forEach(element => {
        element.entryDate = this.formatTime(element.entryDate)
        element.outDate = this.formatTime(element.outDate)
      })
      this.total = res.data.total
      this.outPersonList = res.data.pageData
    }
  }
}
</script>
