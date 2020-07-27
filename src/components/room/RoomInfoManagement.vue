<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>寝室管理</el-breadcrumb-item>
      <el-breadcrumb-item>寝室信息管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="请输入楼栋和寝室号中间用空格分开"
            class="input-with-select"
            v-model="query"
            clearable
            @clear="clearSearchInfo"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchRooms"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="roomList" border stripe>
        <el-table-column label="楼栋" prop="buildNum" align="center"></el-table-column>
        <el-table-column label="寝室号" prop="roomNum" align="center"></el-table-column>
        <el-table-column label="人数" prop="numberOfPeople" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="medium"
              @click="showEditDialog(scope.row)"
            >修改寝室人员</el-button>
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
    <el-dialog title="编辑寝室人员信息" :visible.sync="editDialogVisible" width="50%">
      <el-row>
        <div class="editHead">
          <h1>楼栋:{{editDialogBuildNumber}} 寝室号:{{editDialogRoomNumber}}</h1>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addBedDialogVisible = true"
          >添加成员</el-button>
        </div>
      </el-row>

      <el-row>
        <el-table border stripe width="100%" :data="bedList">
          <el-table-column label="床位" prop="bedNum"></el-table-column>
          <el-table-column label="学号" prop="studentId"></el-table-column>
          <el-table-column label="姓名" prop="studentName"></el-table-column>
          <el-table-column label="班级" prop="className"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="deleteBed(scope.row.studentId)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoomInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加新成员对话框 -->
    <el-dialog
      title="添加新成员"
      :visible.sync="addBedDialogVisible"
      width="30%"
      @close="addBedDialogClosed"
    >
      <el-form label-width="80px" :model="bedInfo">
        <el-form-item label="学号">
          <el-input v-model="inputStudentNumber" @input="searchStuInfo(inputStudentNumber)"></el-input>
        </el-form-item>
        <el-form-item label="姓名">{{bedInfo.studentName}}</el-form-item>
        <el-form-item label="班级">{{bedInfo.className}}</el-form-item>
        <el-form-item label="床位">
          <el-input v-model="bedInfo.bedNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBedDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBedInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        buildNumber: ' ',
        roomNumber: ' ',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 10
      },
      // 用户总记录数
      total: 0,
      // 搜索框的查询内容变量
      query: '',
      // 寝室信息列表
      roomList: [],
      // 将搜索结结果分割后存放的数组
      searchArray: [],
      // 编辑界面是否显示的变量
      editDialogVisible: false,
      // 编辑界面显示楼栋号
      editDialogBuildNumber: '',
      // 编辑界面显示寝室号
      editDialogRoomNumber: '',
      editDialogRoomId: 0,
      addBedDialogVisible: false,
      // 床位信息列表
      bedList: [],
      // 床位信息对象
      bedInfo: {
        studentNumber: '',
        studentName: '输入学号自动填充',
        className: '输入学号自动填充',
        bedNumber: 0
      },
      // 添加新成员时接收学号的变量
      inputStudentNumber: '',
      // 新床位对象
      newBed: {
        studentNumber: '',
        roomId: 0,
        bedNumber: 0
      }
    }
  },
  created() {
    this.getRoomList()
  },
  methods: {
    async getRoomList() {
      // if (this.queryInfo.query !== ' ') {
      //   this.queryInfo.query = this.queryInfo.query.trim()
      // }
      // if (this.queryInfo.query === '') {
      //   this.queryInfo.query = ' '
      // }

      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.searchArray = []
      console.log('搜索的楼栋：' + this.queryInfo.buildNumber)
      console.log('搜索的寝室号：' + this.queryInfo.roomNumber)
      let roomurl = `rooms/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      if (
        this.queryInfo.buildNumber !== ' ' &&
        this.queryInfo.roomNumber !== ' '
      ) {
        roomurl = `rooms/${this.queryInfo.buildNumber}/${this.queryInfo.roomNumber}/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      }
      const { data: res } = await this.$http.get(roomurl)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.roomList = res.data.pageData
      this.total = res.data.total
      setTimeout(() => {
        loading.close()
      }, 800)
    },
    searchRooms() {
      // 对搜索内容做格式化处理
      if (this.query !== '') {
        this.searchArray = this.query.split(' ')
        this.searchArray[0] = this.searchArray[0].replace('#', '%23')
        this.queryInfo.buildNumber = this.searchArray[0]
        this.queryInfo.roomNumber = this.searchArray[1]
        console.log(this.query)
      }
      // 然后再发送到后台
      this.getRoomList()
    },
    clearSearchInfo() {
      this.queryInfo.buildNumber = ' '
      this.queryInfo.roomNumber = ' '
      this.getRoomList()
    },
    // 当页面数量发生改变时触发该方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getRoomList()
    },
    // 当页数发生改变时触发该方法
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getRoomList()
    },
    // 获取床位信息调用该方法
    async getBedList(roomId) {
      const { data: res } = await this.$http.get(`beds/${roomId}`)
      console.log(res)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取床位信息失败')
      }
      this.bedList = res.data
    },
    // 显示编辑窗口触发该方法
    showEditDialog(row) {
      // console.log(row.buildNum)
      // console.log(row.roomNum)
      // console.log(row.roomId)
      this.editDialogBuildNumber = row.buildNum
      this.editDialogRoomNumber = row.roomNum
      this.editDialogRoomId = row.roomId
      this.getBedList(row.roomId)
      this.editDialogVisible = true
    },
    // 动态获取学生信息的方法
    async searchStuInfo(stuId) {
      console.log(stuId)
      const { data: res } = await this.$http.get(`students/${stuId}`)
      console.log(res)
      if (res.data !== null) {
        this.bedInfo = res.data
      } else {
        this.reSetBedInfo()
      }
    },
    reSetBedInfo() {
      this.bedInfo.studentNumber = ''
      this.bedInfo.studentName = '输入学号自动填充'
      this.bedInfo.className = '输入学号自动填充'
      this.bedInfo.bedNumber = 0
    },

    addBedDialogClosed() {
      this.inputStudentNumber = ''
      this.reSetBedInfo()
    },
    async addBedInfo() {
      console.log(this.bedInfo.studentNumber)
      console.log(this.bedInfo.bedNumber)
      console.log(this.editDialogRoomId)
      this.newBed.studentNumber = this.bedInfo.studentNumber
      this.newBed.roomId = this.editDialogRoomId
      this.newBed.bedNumber = this.bedInfo.bedNumber
      const { data: res } = await this.$http.post('/beds', this.newBed)
      console.log(res)
      if (res.meta.status === 900) {
        return this.$message.error('该床位已经有人请选择其他床位')
      }
      if (res.meta.status === 200) {
        this.getBedList(this.editDialogRoomId)
        this.addBedDialogVisible = false
        return this.$message.success('添加成功')
      }
      return this.$message.error('未知错误，床位添加失败')
    },
    // 更新寝室列表信息方法
    updateRoomInfo() {
      this.getRoomList()
      this.editDialogVisible = false
    },
    async deleteBed(studentId) {
      // console.log(studentId)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该记录, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      const { data: res } = await this.$http.delete(`/beds/${studentId}`)
      if (res.meta.status === 200) {
        this.getBedList(this.editDialogRoomId)
        return this.$message.success('删除成功')
      }
      return this.$message.error('未知错误，床位删除失败')
    }
  }
}
</script>

<style lang="less" scoped>
.editHead {
  display: flex;
  justify-content: space-between;
}
</style>
