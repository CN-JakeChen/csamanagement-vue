<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>寝室卫生管理</el-breadcrumb-item>
      <el-breadcrumb-item>寝室卫生成绩录入</el-breadcrumb-item>
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

      <div class="fdiv">
        <el-row :gutter="24" class="header">
          <el-col :span="24">
            <h1>{{roomInfo.buildNum}} {{roomInfo.roomNum}}</h1>
            <el-divider></el-divider>
          </el-col>
        </el-row>
        <el-form ref="form" label-width="100px">
          <div v-for="item in ShowHygieneForm" :key="item.studentNumber">
            <h4>床位{{item.bedNum}}</h4>
            <el-form-item label="姓名">
              <el-input v-model="item.studentId"></el-input>
            </el-form-item>
            <el-form-item label="学号">
              <el-input v-model="item.studentName"></el-input>
            </el-form-item>
            <el-form-item label="班级">
              <el-input v-model="item.className"></el-input>
            </el-form-item>

            <el-form-item label="卫生成绩">
              <el-select v-model="item.personHygieneGradeA" placeholder="请选择">
                <el-option
                  v-for="item in optionsA"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>.
              <el-select v-model="item.personHygieneGradeB" placeholder="请选择">
                <el-option
                  v-for="item in optionsB"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>分
            </el-form-item>
          </div>
          <el-form-item label="寝室卫生成绩">
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

          <el-form-item label="备注">
            <el-input v-model="notes"></el-input>
          </el-form-item>
        </el-form>
        <span>
          <el-button type="primary" :disabled="isDisable" @click="getRoomInfo(++pageNum)">下一寝室</el-button>
        </span>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { Loading } from 'element-ui'
export default {
  data() {
    return {
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
      roomHygieneGradeB: 0,
      //   展示寝室表单的对象
      ShowHygieneForm: [],
      //   存放寝室信息的数组
      roomInfo: {},
      //   页数
      pageNum: 1,
      //   是否禁止按钮
      isDisable: false,
      //   备注
      notes: '',
      //   要发送出去的对象
      roomHygieneForm: {
        roomId: 0,
        roomHygieneGrade: 0.0,
        notes: ''
      },
      studentHygieneForm: []
    }
  },
  created() {
    this.getRoomInfo(1)
  },
  methods: {
    async getRoomInfo(pageNum) {
      // const loading = Loading.service({
      //   lock: true,
      //   text: '努力加载中',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })

      const { data: res } = await this.$http.get(`rooms/${pageNum}/1`)
      console.log(res)
      console.log(res.data.total + 1 + ',' + pageNum)
      if (res.data.total + 1 === pageNum) {
        // this.saveHgiene()
        /// /////////////////
        console.log(
          this.roomInfo.roomId +
            ':' +
            '寝室卫生成绩：' +
            this.roomHygieneGradeA +
            ',' +
            this.roomHygieneGradeB
        )

        this.roomHygieneForm.roomId = this.roomInfo.roomId
        this.roomHygieneForm.roomHygieneGrade = parseFloat(
          this.roomHygieneGradeA + '.' + this.roomHygieneGradeB
        )
        this.roomHygieneForm.notes = this.notes
        const { data: res } = await this.$http.post(
          'roomHygieneGrades',
          this.roomHygieneForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error('添加失败')
        }

        console.log('第三步')
        this.ShowHygieneForm.forEach(element => {
          console.log(
            element.studentId +
              ',个人卫生成绩：' +
              element.personHygieneGradeA +
              '.' +
              element.personHygieneGradeB +
              '分'
          )

          var stObj = {}
          stObj.studentNumber = element.studentId
          stObj.record = parseFloat(
            element.personHygieneGradeA + '.' + element.personHygieneGradeB
          )
          this.studentHygieneForm.push(stObj)
        })
        const { data: res1 } = await this.$http.post(
          'studentHygieneGrades',
          this.studentHygieneForm
        )

        if (res1.meta.status !== 200) {
          return this.$message.error('添加失败')
        }

        this.$message.success('录入成功')
        /// ////////////////
        this.isDisable = true
        // setTimeout(() => {
        //   loading.close()
        // }, 800)
      }
      if (res.data.total < pageNum) {
        return this.$message.info('最后一个寝室了')
      }
      console.log('pagenum:' + pageNum)
      if (pageNum !== 1) {
        // this.saveHgiene()
        /// /////////////////////////
        console.log(
          this.roomInfo.roomId +
            ':' +
            '寝室卫生成绩：' +
            this.roomHygieneGradeA +
            ',' +
            this.roomHygieneGradeB
        )

        this.roomHygieneForm.roomId = this.roomInfo.roomId
        this.roomHygieneForm.roomHygieneGrade = parseFloat(
          this.roomHygieneGradeA + '.' + this.roomHygieneGradeB
        )
        this.roomHygieneForm.notes = this.notes
        const { data: res } = await this.$http.post(
          'roomHygieneGrades',
          this.roomHygieneForm
        )

        if (res.meta.status !== 200) {
          return this.$message.error('添加失败')
        }

        console.log('第三步')
        this.ShowHygieneForm.forEach(element => {
          console.log(
            element.studentId +
              ',个人卫生成绩：' +
              element.personHygieneGradeA +
              '.' +
              element.personHygieneGradeB +
              '分'
          )

          var stObj = {}
          stObj.studentNumber = element.studentId
          stObj.record = parseFloat(
            element.personHygieneGradeA + '.' + element.personHygieneGradeB
          )
          this.studentHygieneForm.push(stObj)
        })
        const { data: res1 } = await this.$http.post(
          'studentHygieneGrades',
          this.studentHygieneForm
        )

        if (res1.meta.status !== 200) {
          return this.$message.error('添加失败')
        }

        this.$message.success('录入成功')
        /// ////////////////////////
      }
      console.log('第一步')
      this.roomInfo = res.data.pageData[0]
      this.getBedsInfo(this.roomInfo.roomId)
      // setTimeout(() => {
      //   loading.close()
      // }, 800)
    },
    async getBedsInfo(roomId) {
      const { data: res } = await this.$http.get(`beds/${roomId}`)
      console.log(res.data)
      res.data.forEach(element => {
        element.personHygieneGradeA = 0
        element.personHygieneGradeB = 0
      })
      this.roomHygieneGradeA = 0
      this.roomHygieneGradeB = 0
      this.notes = ''
      this.studentHygieneForm = []
      this.ShowHygieneForm = res.data
      console.log('第二步')
    },
    async saveHgiene() {}
  }
}
</script>

<style lang="less" scoped>
.header {
  margin-top: 31px;
}

.el-select {
  width: 85px;
}
</style>
