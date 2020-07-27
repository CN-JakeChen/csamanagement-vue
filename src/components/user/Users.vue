<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="请输入用户名"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="openAddDilaog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="用户名" prop="username" align="center"></el-table-column>
        <el-table-column label="密码" prop="password" align="center"></el-table-column>
        <el-table-column label="角色" prop="role" align="center"></el-table-column>
        <el-table-column label="管理范围" prop="filedList" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeUserById(scope.row.id)"
            >删除</el-button>
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

    <!-- 添加用户对话框 -->
    <el-dialog title="添加新用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form ref="addFromRef" :model="addFrom" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="selectedRolevalue" placeholder="请选择" @change="handleSelectedChange">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理范围" v-if="selectedRolevalue===3">
          <el-checkbox-group v-model="checkedBuilds">
            <el-checkbox
              v-for="build in builds"
              :label="build.buildId"
              :key="build.buildId"
            >{{build.buildNum}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="所属院系" v-if="selectedRolevalue===2">
          <!-- <el-checkbox-group v-model="checkedDepts">
            <el-checkbox
              v-for="dept in depts"
              :label="dept.deptId"
              :key="dept.deptId"
            >{{dept.deptName}}</el-checkbox>
          </el-checkbox-group>-->
          <el-select v-model="checkedDepts" placeholder="请选择">
            <el-option
              v-for="dept in depts"
              :label="dept.deptName"
              :key="dept.deptId"
              :value="dept.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
        query: ' ',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条
        pagesize: 10
      },
      // 用户列表对象
      userList: [],
      // 用户总记录数
      total: 0,
      // 控制是否显示添加用户对话框
      addDialogVisible: false,
      // 添加的新用户的表单信息
      addFrom: {
        username: '',
        password: '',
        role: 1,
        dept: 0,
        manfield: []
      },
      // 对添加新用户表单的验证规则
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在6-15个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 角色选项内容
      roleOptions: [
        {
          value: 1,
          label: '系统管理员'
        },
        {
          value: 2,
          label: '学生管理员'
        },
        {
          value: 3,
          label: '公寓管理员'
        }
      ],
      // 已选角色值
      selectedRolevalue: 1,
      // 楼栋选项内容
      buildOptions: [],
      // 楼栋列表
      builds: [],
      // 已选择楼栋
      checkedBuilds: [],
      // 院系选项列表
      deptOptions: [],
      // 院系列表
      depts: [],
      // 已选院系
      checkedDepts: 0,
      // 编辑对话框是否显示变量
      editDialogVisible: false,
      // 编辑表单对象信息
      editForm: {
        userId: 0,
        username: '',
        password: ''
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表方法
    async getUserList() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      console.log(this.queryInfo.query)
      if (this.queryInfo.query !== ' ') {
        this.queryInfo.query = this.queryInfo.query.trim()
      }
      if (this.queryInfo.query === '') {
        this.queryInfo.query = ' '
      }
      const { data: res } = await this.$http.get(
        `users/${this.queryInfo.query}/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.pageData
      // 对数据做处理
      this.userList.forEach(element => {
        // console.log(element.role)
        if (element.role === 1) {
          element.role = '系统管理员'
        } else if (element.role === 2) {
          element.role = '学生管理员'
          element.filedList = [element.deptName]
        } else {
          element.role = '寝室管理员'
        }
      })
      this.total = res.data.total
      if (this.queryInfo.query === ' ') {
        this.queryInfo.query = ''
      }
      setTimeout(() => {
        loading.close()
      }, 800)
    },
    // 当页面数量发生改变时触发该方法
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 当页数发生改变时触发该方法
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 当添加用户界面关闭时触发该方法
    addDialogClosed() {
      this.$refs.addFromRef.resetFields()
      this.selectedRolevalue = 1
      this.checkedBuilds = []
      this.checkedDepts = 0
      this.addFrom.role = 1
    },
    // 添加用户的方法
    addUser() {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入正确的数据')
        }
        this.addFrom.role = this.selectedRolevalue
        // this.addFrom.role = this.addFrom.role
        this.addFrom.manfield = this.checkedBuilds
        this.addFrom.dept = this.checkedDepts
        // console.log('用户名：' + this.addFrom.username)
        // console.log('密码：' + this.addFrom.password)
        // console.log('角色值：' + this.addFrom.role)
        // console.log('所属院系id：' + this.addFrom.dept)
        // console.log('楼栋Id：' + this.addFrom.manfield)
        // console.log('已选角色值：' + this.selectedRolevalue)
        // console.log('已选楼栋id：' + this.checkedBuilds)
        // console.log('已选所属院系Id：' + this.checkedDepts)

        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addFrom)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('添加失败')
        }
        console.log(res.meta.status + '这儿')
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getUserList()
        console.log(this.checkedDepts)
      })
    },
    // 打开添加用户界面的时候获取楼栋选项列表
    async openAddDilaog() {
      const { data: res } = await this.$http.get('builds')
      this.buildOptions = res.data
      this.builds = this.buildOptions
      const { data: res1 } = await this.$http.get('depts')
      this.deptOptions = res1.data
      this.depts = this.deptOptions
      this.addDialogVisible = true
      console.log(res.data)
      console.log(res1.data)
    },
    // 添加用户的角色选择框改变时触发的事件
    handleSelectedChange() {
      this.checkedBuilds = []
      this.checkedDepts = 0
    },
    // 显示编辑对话框时触发的事件
    showEditDialog(row) {
      // console.log(row.id)
      // console.log(row.password)
      this.editForm.userId = row.id
      this.editForm.username = row.username
      this.editForm.password = row.password
      this.editDialogVisible = true
    },
    // 向后台发送修改请求的方法
    async editUserInfo() {
      // 发起网络请求
      const { data: res } = await this.$http.put('users/', this.editForm)

      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }

      // 关闭对话框
      this.editDialogVisible = false
      // 刷新数据列表
      this.getUserList()
      // 提示修改成功
      this.$message.success('更新成功')
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    async removeUserById(id) {
      console.log(id)
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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

      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.info('删除失败')
      }

      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}
</style>
