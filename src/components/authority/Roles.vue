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
          <el-table-column type="expand"
                           width="48">
            <template slot-scope="scope">
              <ElCol v-for="(item, index) in scope.row.children"
                     :key="index"
                     class="bdtop"
                     type="flex"
                     align="middle">
                <ElCol :span="24">
                  <!-- 第一层 -->
                  <ElCol :span="6"
                         type="flex"
                         align="middle">
                    <ElTag type="info"
                           @close="removeRightsById(scope.row.id,item.id)"
                           closable>{{item.authName}}</ElTag>
                    <i class="el-icon-caret-right"></i>
                  </ElCol>
                  <ElCol :span="18"
                         type="flex"
                         justify="start">
                    <ElRow v-for="(item2, index) in item.children"
                           :key="index">
                      <!-- 第二层 -->
                      <ElCol :span="6">
                        <ElTag type="success"
                               @close="removeRightsById(scope.row.id,item2.id)"
                               closable>{{item2.authName}}</ElTag>
                        <i class="el-icon-caret-right"></i>
                      </ElCol>
                      <!-- 第三层 -->
                      <ElCol :span="18">
                        <ElTag style="margin-right:20px"
                               type="warning"
                               @close="removeRightsById(scope.row.id,item3.id)"
                               v-for="(item3, index) in item2.children"
                               :key="index"
                               closable>{{item3.authName}}</ElTag>
                      </ElCol>
                    </ElRow>
                  </ElCol>
                </ElCol>
              </ElCol>
            </template>
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
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini">
                  <span>编辑</span>
                </el-button>
                <!-- 删除 -->
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"><span>删除</span></el-button>
                <!-- 分配角色 -->
                <el-button type="warning"
                           icon="el-icon-setting"
                           size="mini"
                           @click="showSetRightDialog(scope.row)"><span>分配权限</span></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <el-dialog title="提示"
               :visible.sync="showSetRightTreeVisbale"
               width="50%">
      <!-- 权限树 -->
      <el-tree :data="rightTree"
               show-checkbox
               default-expand-all
               :default-checked-keys="defKeys"
               node-key="id"
               :props="rightTreeProps"
               ref="treeRef">
      </el-tree>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showSetRightTreeVisbale = false">取 消</el-button>
        <el-button type="primary"
                   @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { async } from 'q'
import { log } from 'util'
export default {
  data() {
    return {
      users: [],
      showSetRightTreeVisbale: false, //分配配权限对话框隐藏显示
      rightTree: [], //分配配权限tree
      rightTreeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的树节点
      defKeys: [],
      roleId: Number
    }
  },
  methods: {
    async allotRights(roleId) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const str = keys.join(',')
      //   console.log(str)
      //   console.log(this.roleId)
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: str
        }
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.showSetRightTreeVisbale = false
      this.getUserList()
    },
    getDefKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(element => {
        this.getDefKeys(element, arr)
      })
    },
    async getUserList() {
      const { data: res } = await this.$http.get('/roles')
      this.users = res.data
    },
    async removeRightsById(roleId, rightId) {
      let result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') return this.$message.info('已取消删除')
      console.log('确认删除')
      const { data: res } = await this.$http.delete(
        `roles/${roleId}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.info(res.meta.msg)
      let index = this.users.findIndex(item => {
        if (item.id === roleId) return true
      })
      this.getUserList()
    },
    async showSetRightDialog(row) {
      this.roleId = row.id
      const { data: res } = await this.$http.get('rights/tree')
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightTree = res.data
      this.defKeys = [] //清空defkeys
      this.getDefKeys(row, this.defKeys) //递归循环添加defkeys
      this.showSetRightTreeVisbale = true
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.centered {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #ccc;
}
</style>
