<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png"
             alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info"
                 @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="!isCollapse ? '200px' : '64px'">
        <div class="toggle-button"
             @click="toggleCollapse">
          |||
        </div>
        <el-row class="tac">
          <el-col>
            <el-menu class="el-menu-vertical-demo"
                     background-color="#373d41"
                     text-color="#fff"
                     active-text-color="#409EFF"
                     :default-active="activePath"
                     unique-opened
                     router
                     :collapse="isCollapse"
                     :collapse-transition="false">
              <el-submenu :index="item.id + ''"
                          v-for="item in menuList"
                          :key="item.id">
                <!-- 一级菜单 -->
                <template slot="title">
                  <i :class="iconObj[item.id]"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item :index="'/' + subItem.path"
                              v-for="subItem in item.children"
                              :key="subItem.id"
                              @click="saveNavState('/' + subItem.path)">
                  <!-- 二级菜单 -->
                  <template>
                    <i class="el-icon-menu"></i>
                    <span>{{ subItem.authName }}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: {},
      // 左侧菜单icon
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 被激活的连接地址
      activePath: '',
      // 是否收起菜单
      isCollapse: false
    }
  },
  methods: {
    // 退出登陆
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单列表失败')
      }
      this.menuList = res.data
      //   console.log(this.menuList)
    },
    // 保存当前点击的路径
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 切换菜单
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      console.log(this.isCollapse)
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #373d41;
  color: #fff;
  line-height: 60px;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    img {
      margin-right: 10px;
      font-size: 16px;
    }
  }
  .el-button {
    curson: pointer;
  }
}
.el-aside {
  background-color: #373d41;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-menu {
    border-right: none;
  }
  .el-submenu {
    i {
      margin-right: 5px;
    }
  }
}
.el-main {
  background-color: #e9eef3;
}
// 菜单切换按钮
.toggle-button {
  line-height: 24px;
  color: #fff;
  letter-spacing: 3px;
  cursor: pointer;
  background: #4a5064;
}
</style>
