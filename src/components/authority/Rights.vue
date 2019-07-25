<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面板 -->
    <el-card class="box-card"
             style="margin-top:10px">
      <!-- 表格 -->
      <template>
        <el-table :data="list"
                  border
                  stripe
                  style="width: 100%;margin-bottom:20px">
          <el-table-column type="index"
                           width="48">
          </el-table-column>
          <el-table-column prop="authName"
                           label="权限名称">
          </el-table-column>
          <el-table-column prop="path"
                           label="路径">
          </el-table-column>
          <el-table-column prop="level"
                           label="等级">
            <template slot-scope="scope">
              <div>
                <el-tag :type="scope.row.level == 0 ? '' : scope.row.level == 1 ? 'success' : 'warning'"
                        v-cloak>{{level[scope.row.level]}}</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      level: ['一级', '二级', '三级'],
      list: []
    }
  },
  methods: {
    async showList() {
      const { data: res } = await this.$http.get(`rights/list`)
      //   console.log(res)
      this.list = res.data
    }
  },
  created() {
    this.showList()
  }
}
</script>

<style lang="less" scoped>
</style>
