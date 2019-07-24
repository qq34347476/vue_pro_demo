<template>
  <el-container>
    <el-header>Header
      <el-button type="infor"
                 class="log-out"
                 @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #2b4b6b;
    .log-out {
      position: absolute;
      top: 10px;
      right: 20px;
    }
  }
  .el-aside {
    background-color: pink;
  }
}
</style>
