<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="chartdiv" id="myChartPie"></div>
      <div class="builddiv">
        <span>楼栋：</span>
        <el-select v-model="buildValue" placeholder="请选择">
          <el-option
            v-for="item in buildOptions"
            :key="item.buildNum"
            :label="item.buildNum"
            :value="item.buildNum"
          ></el-option>
        </el-select>
        <!-- <span>时间：</span>
        <el-select v-model="timeValue" placeholder="请选择">
          <el-option
            v-for="item in timeOptions"
            :key="item.lable"
            :label="item.lable"
            :value="item.lable"
          ></el-option>
        </el-select>-->
        <el-button type="primary">筛选</el-button>
      </div>

      <div class="chartdiv" id="myChartLine"></div>
    </el-card>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      RoomRecordStatisticsData: [],
      buildOptions: [],
      // timeOptions: [
      //   { value: 1, lable: '近七天' },
      //   { value: 2, lable: '近一个月' }
      // ],
      buildValue: '',
      // timeValue: '',
      AlienStatisticsData: []
    }
  },
  mounted() {
    this.getRoomRecordStatisticsData()
    this.getAlienStatisticsData()
  },
  created() {
    this.getBuilds()
  },
  methods: {
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(
        document.getElementById('myChartPie'),
        null,
        { renderer: 'svg' }
      )
      // 绘制图表
      myChart.setOption({
        title: {
          text: '本周寝室卫生成绩分布饼图',
          subtext: '全校',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['<=6分', '6-7分', '7-8分', '8-9分', '9-10分']
        },
        series: [
          {
            name: '卫生成绩',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.RoomRecordStatisticsData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(
        document.getElementById('myChartLine'),
        null,
        { renderer: 'svg' }
      )
      // 绘制图表
      myChart.setOption({
        title: {
          text: '上周外来人员进入数量折线图',
          subtext: '全校',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: [
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六',
            '星期日'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.AlienStatisticsData,
            type: 'line'
          }
        ]
      })
    },
    async getRoomRecordStatisticsData() {
      const { data: res } = await this.$http.get('/statistics/1')
      console.log(res.data)
      this.RoomRecordStatisticsData = res.data
      this.drawPie()
    },
    async getAlienStatisticsData() {
      const { data: res } = await this.$http.get('/statistics/2')
      console.log(res.data)
      this.AlienStatisticsData = res.data
      this.drawLine()
    },
    async getBuilds() {
      const loading = Loading.service({
        lock: true,
        text: '努力加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get('/builds')
      console.log(res.data)
      this.buildOptions = res.data
      setTimeout(() => {
        loading.close()
      }, 800)
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-left: 10px;
}
// span{
//   margin-left: 90px;
// }
.chartdiv {
  margin-bottom: 120px;
  margin-left: 20px;
  margin-right: 20px;
  border: 1px solid gainsboro;
  height: 400px;
  border-radius: 4px;
}
.builddiv {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
