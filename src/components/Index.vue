<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo_header.png" alt />
        <span class="hidden-xs-only">学生公寓信息管理系统</span>
        <el-menu
          class="hidden-sm-and-up"
          mode="horizontal"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          router
        >
          <el-submenu index="0">
            <template slot="title">菜单</template>
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <template slot="title">{{item.authName}}</template>
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >{{subItem.authName}}</el-menu-item>
              <!-- <el-menu-item index="1-2-1">换届数据更新</el-menu-item> -->
            </el-submenu>
            <!-- <el-submenu index="2-1">
              <template slot="title">用户管理</template>
              <el-menu-item index="2-1-1">用户信息管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3-1">
              <template slot="title">寝室管理</template>
              <el-menu-item index="3-1-1">寝室信息管理</el-menu-item>
            </el-submenu>
            <el-submenu index="4-1">
              <template slot="title">寝室卫生管理</template>
              <el-menu-item index="4-1-1">寝室卫生成绩录入</el-menu-item>
              <el-menu-item index="4-2-1">寝室卫生成绩管理</el-menu-item>
            </el-submenu>
            <el-submenu index="5-1">
              <template slot="title">公寓人员出入管理</template>
              <el-menu-item index="5-1-1">外来人员登记</el-menu-item>
              <el-menu-item index="5-2-1">学生离校登记</el-menu-item>
            </el-submenu>
            <el-submenu index="6-1">
              <template slot="title">统计</template>
              <el-menu-item index="6-1-1">菜单1-1</el-menu-item>
            </el-submenu>-->
          </el-submenu>
        </el-menu>
      </div>

      <el-menu
        mode="horizontal"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409eff"
        @select="handleSelect"
      >
        <el-tooltip class="item" effect="dark" content="全屏" placement="top-end">
          <div
            @click="clickFullscreen()"
            style="float:left;height:60px;line-height:60px;margin-right:30px"
            class="hidden-xs-only"
          >
            <i class="el-icon-full-screen iconbg"></i>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="帮助" placement="top-end">
          <div
            @click="develping()"
            style="float:left;height:60px;line-height:60px;margin-right:30px"
            class="hidden-xs-only"
          >
            <i class="el-icon-help iconbg"></i>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="夜间模式" placement="top-end">
          <div
            @click="develping()"
            style="float:left;height:60px;line-height:60px;margin-right:30px"
            class="hidden-xs-only"
          >
            <i class="el-icon-moon-night iconbg"></i>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="消息" placement="top-end">
          <div
            @click="develping()"
            style="float:left;height:60px;line-height:60px;margin-right:30px"
            class="hidden-xs-only"
          >
            <i class="el-icon-message iconbg"></i>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="通知" placement="top-end">
          <div
            @click="develping()"
            style="float:left;height:60px;line-height:60px;margin-right:3px"
            class="hidden-xs-only"
          >
            <i class="el-icon-message-solid iconbg"></i>
          </div>
        </el-tooltip>
        <el-submenu index="0">
          <template slot="title">
            <!-- <i class="el-icon-folder"></i> -->
            <el-avatar :src="headurl.url" size="medium"></el-avatar>
            {{username}}
          </template>
          <el-menu-item index="2-1-1-1">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-setting iconbg"></i>
              <!-- 文本 -->
              <span>用户设置</span>
            </template>
          </el-menu-item>
          <el-menu-item index="3-1-1-1">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-switch-button iconbg"></i>
              <!-- 文本 -->
              <span>退出</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- <el-button type="info" @click="logout">退出</el-button> -->
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边区域 -->
      <el-aside width="250px" class="hidden-xs-only">
        <!-- 侧边栏 -->
        <el-menu
          background-color="#333744"
          text-color="#d7d7d7"
          active-text-color="#409eff"
          unique-opened
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu iconbg"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import screenfull from 'screenfull'
export default {
  data() {
    return {
      // 被激活的链接地址
      username: '未登录',
      activePath: '',
      menuList: [],
      iconList: {
        1: 'el-icon-folder iconbg',
        2: 'el-icon-user iconbg',
        3: 'el-icon-school iconbg',
        4: 'el-icon-toilet-paper iconbg',
        5: 'el-icon-s-order iconbg',
        6: 'el-icon-pie-chart iconbg'
      },
      headurl: { url: require('@/assets/girlhead.png') }
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.username = window.sessionStorage.getItem('username')
  },
  methods: {
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    handleSelect(key, keyPath) {
      if (key === '2-1-1-1') {
        alert('该功能正在开发中，敬请期待')
      } else if (key === '3-1-1-1') {
        console.log('退出')
        this.logout()
      }
    },
    clickFullscreen() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    develping() {
      alert('该功能正在开发中，敬请期待')
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  position: relative;
  width: 100%;
  height: 60px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-avatar {
  margin-right: 7px;
  background-color: white;
}
.el-aside {
  background-color: #333744;
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  .el-menu {
    border-right: none;
  }
}

@media only screen and (min-width: 768px) {
  .el-main {
    background-color: #eaedfe;
    position: absolute;
    left: 250px;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
  }
}

@media only screen and (max-width: 767px) {
  .el-main {
    background-color: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
  }
}

.home-container {
  height: 100%;
}
img {
  width: 30px;
}
.iconbg {
  color: #d7d7d7;
}
</style>
