<template>
  <div>
    <!-- 面包屑视图区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据管理</el-breadcrumb-item>
      <el-breadcrumb-item>初始化导入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="fdiv">
        <span style="font-size:14px;color:red;margin-bottom:4px"><i class="el-icon-warning"></i> 注意:上传的文件内容格式请严格根据模板来填写</span>
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:8095/import/initfile"
          multiple
          :on-success="onsuccess"
          :on-error="onerror"
          :headers="header"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
        </el-upload>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      header: { Token: window.sessionStorage.getItem('token') }
    }
  },
  methods: {
    onsuccess(response, file, fileList) {
      console.log(response)
    },
    onerror(err, file, fileList) {
      console.log(err)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
