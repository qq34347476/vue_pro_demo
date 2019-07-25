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
      <ElButton type="primary"
                style="margin-bottom:20px">添加角色</ElButton>
      <!-- 表格 -->
      <template>
        <el-table :data="users"
                  border
                  stripe
                  style="width: 100%;margin-bottom:20px">
          <el-table-column width="48">
          </el-table-column>
          <el-table-column type="index"
                           width="48">
          </el-table-column>
          <el-table-column prop="roleName"
                           label="角色名称">
          </el-table-column>
          <el-table-column prop="roleDesc"
                           label="角色描述">
          </el-table-column>
          <el-table-column label="操作"
                           width="300">

            <template slot-scope="scope">
              <div>
                <!-- 编辑 -->
                <el-tooltip effect="dark"
                            content="编辑"
                            placement="top">
                  <el-button type="primary"
                             icon="el-icon-edit"
                             size="mini">
                    <span>编辑</span>
                  </el-button>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip effect="dark"
                            content="删除"
                            placement="top">
                  <el-button type="danger"
                             icon="el-icon-delete"
                             size="mini"><span>删除</span></el-button>
                </el-tooltip>
                <!-- 分配角色 -->
                <el-tooltip effect="dark"
                            content="分配角色"
                            placement="top">
                  <el-button type="warning"
                             icon="el-icon-setting"
                             size="mini"><span>角色分配</span></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import { async } from 'q'
export default {
  data() {
    return {
      users: []
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/roles')
      console.log(res)
      this.users = res.data
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
