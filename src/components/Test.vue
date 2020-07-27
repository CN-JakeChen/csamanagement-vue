<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      action="http://localhost:8095/import/initfile"
      multiple
      :on-success="onsuccess"
      :on-error="onerror"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
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
