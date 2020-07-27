<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>寝室卫生管理</el-breadcrumb-item>
      <el-breadcrumb-item>寝室卫生成绩管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请输入楼栋和寝室号中间用空格分开" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="roomRecordData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.studentHygieneGradeInfoList" border style="width: 100%">
              <el-table-column prop="bedNumber" label="床位" width="180"></el-table-column>
              <el-table-column prop="studentNumber" label="学号" width="180"></el-table-column>
              <el-table-column prop="studentName" label="姓名" width="180"></el-table-column>
              <el-table-column prop="className" label="班级" width="180"></el-table-column>
              <el-table-column prop="record" label="个人卫生成绩"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="楼栋" prop="buildNumber"></el-table-column>
        <el-table-column label="寝室号" prop="roomNumber"></el-table-column>
        <el-table-column label="寝室分" prop="roomGrade"></el-table-column>
        <el-table-column label="记录时间" prop="recordTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="edit(scope.row)">修改</el-button>
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

    <!-- 修改对话框 -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-row>
        <div class="editHead">
          <h1>楼栋:{{editDialogBuildNumber}} 寝室号:{{editDialogRoomNumber}}</h1>
        </div>
      </el-row>

      <el-form label-width="80px">
        <el-form-item label="寝室成绩">
          <el-select v-model="roomHygieneGradeA" placeholder="请选择">
            <el-option
              v-for="item in optionsA"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>.
          <el-select v-model="roomHygieneGradeB" placeholder="请选择">
            <el-option
              v-for="item in optionsB"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>分
        </el-form-item>
        <el-form-item
          :label="item.studentName"
          v-for="item in studentRecordFormList"
          v-bind:key="item.studentNumber"
        >
          <el-select v-model="item.studentHygieneGradeA" placeholder="请选择">
            <el-option
              v-for="item in optionsA"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>.
          <el-select v-model="item.studentHygieneGradeB" placeholder="请选择">
            <el-option
              v-for="item in optionsB"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>分
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="updateGrade">确 定</el-button>
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
        pagesize: 5
      },
      total: 0,
      roomRecordData: [],
      studentRecordData: [],
      editDialogVisible: false,
      editDialogBuildNumber: '',
      editDialogRoomNumber: '',
      roomRecordForm: {
        roomRecordId: 0,
        record: 0.0,
        recordTime: 0
      },
      studentRecordForm: {
        studentRecordId: 0,
        record: 0.0
      },
      studentRecordFormList: [],
      sRecordFormList: [],
      optionsA: [
        {
          value: 10,
          label: '10'
        },
        {
          value: 9,
          label: '9'
        },
        {
          value: 8,
          label: '8'
        },
        {
          value: 7,
          label: '7'
        },
        {
          value: 6,
          label: '6'
        },
        {
          value: 5,
          label: '5'
        },
        {
          value: 4,
          label: '4'
        },
        {
          value: 3,
          label: '3'
        },
        {
          value: 2,
          label: '2'
        },
        {
          value: 1,
          label: '1'
        }
      ],
      optionsB: [
        {
          value: 9,
          label: '9'
        },
        {
          value: 8,
          label: '8'
        },
        {
          value: 7,
          label: '7'
        },
        {
          value: 6,
          label: '6'
        },
        {
          value: 5,
          label: '5'
        },
        {
          value: 4,
          label: '4'
        },
        {
          value: 3,
          label: '3'
        },
        {
          value: 2,
          label: '2'
        },
        {
          value: 1,
          label: '1'
        },
        {
          value: 0,
          label: '0'
        }
      ],
      // 寝室卫生成绩整数部分
      roomHygieneGradeA: 0,
      // 寝室卫生成绩小数部分
      roomHygieneGradeB: 0
    }
  },
  created() {
    this.getRoomHygieneGradeList()
  },
  methods: {
    async getRoomHygieneGradeList() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get(
        `roomHygieneGrades/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      console.log(res.data.pageData)
      res.data.pageData.forEach(element => {
        element.recordTime = this.formatTime(element.recordTime)
      })
      this.roomRecordData = res.data.pageData
      this.total = res.data.total
      setTimeout(() => {
        loading.close()
      }, 800)
    },

    edit(row) {
      console.log('编辑：' + row.roomId)
      this.editDialogBuildNumber = row.buildNumber
      this.editDialogRoomNumber = row.roomNumber
      // this.studentRecordFormList = row.studentHygieneGradeInfoList
      row.studentHygieneGradeInfoList.forEach(element => {
        var stObj = {}
        stObj.studentRecordId = element.studentRecordId
        const spointArray = element.record.toString().split('.')
        stObj.studentHygieneGradeA = spointArray[0]
        stObj.studentHygieneGradeB = spointArray[1]
        stObj.studentName = element.studentName
        this.studentRecordFormList.push(stObj)
      })
      this.roomRecordForm.roomRecordId = row.roomRecordId
      this.roomRecordForm.recordTime = row.recordTime
      this.apartGrade(row.roomGrade)
      this.editDialogVisible = true
    },
    apartGrade(grade) {
      console.log(grade)
      const pointArray = grade.toString().split('.')
      console.log(pointArray[0] + ',' + pointArray[1])
      this.roomHygieneGradeA = pointArray[0]
      this.roomHygieneGradeB = pointArray[1]
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
      this.getRoomHygieneGradeList()
    },
    // 当页数发生改变时触发该方法
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getRoomHygieneGradeList()
    },
    editDialogClosed() {
      console.log('关闭')
      this.studentRecordFormList = []
      this.sRecordFormList = []
      this.studentRecordFormList = []
    },
    async updateGrade() {
      const rpoint = parseFloat(
        this.roomHygieneGradeA + '.' + this.roomHygieneGradeB
      )
      console.log(rpoint)
      this.roomRecordForm.record = rpoint
      console.log(
        this.roomRecordForm.record +
          '//' +
          this.roomRecordForm.roomRecordId +
          '//' +
          this.roomRecordForm.recordTime
      )

      const { data: res } = await this.$http.put(
        `roomHygieneGrades/${this.roomRecordForm.roomRecordId}/${
          this.roomRecordForm.record
        }/${new Date(this.roomRecordForm.recordTime)}`
      )
      console.log(res.meta.msg)
      if (res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }

      this.studentRecordFormList.forEach(element => {
        // console.log(element)
        var stObj = {}
        stObj.studentRecordId = element.studentRecordId
        stObj.studentHygieneGrade = parseFloat(
          element.studentHygieneGradeA + '.' + element.studentHygieneGradeB
        )
        stObj.recordTime = new Date(this.roomRecordForm.recordTime)
        this.sRecordFormList.push(stObj)
      })
      console.log(this.sRecordFormList)

      const { data: res1 } = await this.$http.put(
        'studentHygieneGrades',
        this.sRecordFormList
      )

      if (res1.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success('修改成功')
      this.getRoomHygieneGradeList()
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.editHead {
  display: flex;
  justify-content: space-between;
}
.el-select {
  width: 85px;
}
</style>
