<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card"
             style="margin-top:10px">
      <el-row :gutter="20"
              style="margin-bottom:20px">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <div style="margin-top: 0px;">
              <el-input placeholder="请输入内容"
                        v-model="search"
                        class="input-with-select">
                <el-button slot="append"
                           icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-button type="info"
                       @click="dialogFormVisible = true">添加用户</el-button>

            <el-dialog title="收货地址"
                       :visible.sync="dialogFormVisible">
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForms"
                       label-width="100px">
                <el-form-item label="用户名"
                              prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码"
                              prop="password">
                  <el-input v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱"
                              prop="email">
                  <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机"
                              prop="mobile">
                  <el-input v-model="ruleForm.mobile"></el-input>
                </el-form-item>

              </el-form>
              <div slot="footer"
                   class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary"
                           @click="addDialog">确 定</el-button>
              </div>
            </el-dialog>

          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <template>
        <el-table :data="list"
                  border
                  style="width: 100%;margin-bottom:20px">
          <el-table-column type="index"
                           width="48">
          </el-table-column>
          <el-table-column prop="id"
                           label="ID"
                           width="48">
          </el-table-column>
          <el-table-column prop="username"
                           label="姓名">
          </el-table-column>
          <el-table-column prop="email"
                           label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile"
                           label="电话">
          </el-table-column>
          <el-table-column prop="role_name"
                           label="角色">
          </el-table-column>
          <el-table-column prop="mg_state"
                           label="状态"
                           min-width="170">
            <template slot-scope="scope">
              <div>
                <el-switch @change="changeUserStatus(scope.row)"
                           v-model="scope.row.mg_state"
                           inactive-color="#110, 110, 110">
                </el-switch>
              </div>
            </template>

          </el-table-column>
          <el-table-column label="操作"
                           width="180"
                           fixed="right">

            <template slot-scope="scope">
              <div>
                <!-- 编辑 -->
                <el-tooltip effect="dark"
                            content="编辑"
                            placement="top">
                  <el-button type="primary"
                             icon="el-icon-edit"
                             size="mini"></el-button>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip effect="dark"
                            content="删除"
                            placement="top">
                  <el-button type="warning"
                             icon="el-icon-delete"
                             size="mini"></el-button>
                </el-tooltip>
                <!-- 分配角色 -->
                <el-tooltip effect="dark"
                            content="分配角色"
                            placement="top">
                  <el-button type="danger"
                             icon="el-icon-setting"
                             size="mini"></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="getListParams.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="getListParams.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { isNumber } from 'util'
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请按输入正确的邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '请输入长度为11位的手机号',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisible: false,
      search: '',
      getListParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      list: [],
      total: 1
    }
  },
  methods: {
    addDialog() {
      //写到这里了
      this.$refs.ruleForms.resetFields()
    },
    closeDialog() {
      this.$refs.ruleForms.resetFields()
      this.dialogFormVisible = false
    },
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.getListParams
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.list = res.data.users
      this.total = res.data.total
      this.pagenum = res.data.pagenum
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getListParams.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getListParams.pagenum = val
      this.getUserList()
    },
    async changeUserStatus(userInfo) {
      let uId = Number(userInfo.id)
      let type = userInfo.mg_state

      const { data: res } = await this.$http.put(`users/${uId}/state/${type}`)
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
</style>
