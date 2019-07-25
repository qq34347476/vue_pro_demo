<template>
  <el-container>
    <el-header>
      <div class="title">
        <h1>
          <router-link to="/home"><img src="../assets/heima.png"
                 alt="heima"></router-link>
        </h1>
        <p>黑马后台管理系统</p>
      </div>
      <el-button type="primary"
                 class="log-out"
                 @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isOpen ? '64px' : '200px'">
        <div class="toggle-button"
             @click="isOpen = !isOpen">|||
        </div>

        <el-menu :unique-opened="true"
                 :default-active="activePath"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :collapse-transition="false"
                 :collapse="isOpen"
                 router>
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList"
                      :key="item.id"
                      :index="item.id + ''">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span v-cloak>{{ item.authName }}</span>
            </template>
            <el-menu-item v-for="subItem in item.children"
                          :key="subItem.id"
                          :index="'/' + subItem.path">
              <template slot="title">
                <i :class="iconObj[subItem.id]"></i>
                <span v-cloak>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-tools',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-data',
        '110': 'el-icon-user',
        '111': 'el-icon-s-custom',
        '112': 'el-icon-s-custom',
        '104': 'el-icon-coordinate',
        '115': 'el-icon-coordinate',
        '121': 'el-icon-coordinate',
        '107': 'el-icon-coordinate',
        '146': 'el-icon-coordinate'
      },
      isOpen: false,
      activePath: '/welcome'
    }
  },
  methods: {
    logOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    getActivePath() {
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  },
  created() {
    this.getMenuList()
    this.getActivePath()
  },
  watch: {
    '$route.path': function(newVal, oldVal) {
      this.activePath = newVal
      window.sessionStorage.setItem('activePath', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #545c64;
    .title {
      display: flex;
      align-items: center;

      p {
        font-size: 18px;
        color: floralwhite;
        margin-left: 30px;
      }
    }
    .log-out {
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 14px;
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
