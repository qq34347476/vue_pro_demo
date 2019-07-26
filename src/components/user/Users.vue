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
                        v-model="getListParams.query"
                        clearable
                        @clear="getUserList"
                        class="input-with-select">
                <el-button slot="append"
                           icon="el-icon-search"
                           @click="getUserList"></el-button>
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-button type="info"
                       @click="dialogFormVisible = true">添加用户</el-button>
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
                             @click="showEdit(scope.row.id)"
                             icon="el-icon-edit"
                             size="mini"></el-button>
                </el-tooltip>
                <!-- 删除 -->
                <el-tooltip effect="dark"
                            content="删除"
                            placement="top">
                  <el-button type="warning"
                             @click="deleteUser(scope.row.id)"
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

    <!--添加用户-->
    <el-dialog title="添加用户"
               @close="closeDialog"
               :visible.sync="dialogFormVisible">
      <!-- 添加用户表单 -->
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForms"
               label-width="100px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="ruleForm.username"></el-input>
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改用户资料-->
    <el-dialog title="修改资料"
               :visible.sync="editDialogVisible"
               width="50%">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForms"
               label-width="100px">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="ruleForm.username"
                    disabled></el-input>
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

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser">修 改</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { isNumber } from 'util'
export default {
  data() {
    //自定义邮箱验证规则
    const checkEmail = (rule, value, callback) => {
      let regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!regEmail.test(value)) return callback(new Error('邮箱格式不正确'))
      return callback()
    }
    //自定义手机验证
    const checkMobile = (rule, value, callback) => {
      let regMobile = /^1[356789]\d{9}$/
      if (!regMobile.test(value)) return callback(new Error('手机格式不正确'))
      return callback()
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //验证表单匹配规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      editDialogVisible: false,
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
    //删除用户操作
    async deleteUser(id) {
      const result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (result !== 'confirm') return this.$message('已取消删除')
      const { data: res } = await this.$http.delete('/users/' + id)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.getUserList()
      this.$message(res.meta.msg)
    },
    //提交编辑
    editUser() {
      this.$refs.ruleForms.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          '/users/' + this.ruleForm.id,
          {
            email: this.ruleForm.email,
            mobile: this.ruleForm.mobile
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message(res.meta.msg)
        this.$message(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    //显示编辑
    async showEdit(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.ruleForm = res.data
      this.editDialogVisible = true
    },
    //点击添加用户时触发
    addDialog() {
      this.$refs.ruleForms.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/users', this.ruleForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message(res.meta.msg)
        this.getUserList()
        this.$message(res.meta.msg)
        this.dialogFormVisible = false
      })
    },
    //关闭dialog时候
    closeDialog() {
      this.$refs.ruleForms.resetFields()
    },
    //获取刷新用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.getListParams
      })
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.list = res.data.users
      this.total = res.data.total
      this.pagenum = res.data.pagenum
    },
    //切换每页显示数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getListParams.pagesize = val
      this.getUserList()
    },
    //切换当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getListParams.pagenum = val
      this.getUserList()
    },
    //修改角色状态
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
