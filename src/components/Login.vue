<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt />
      </div>
      <!-- 登陆 -->
      <el-form ref="restLoginRef"
               :rules="loginFormRules"
               :model="loginForm"
               label-width="80px"
               class="login_form">
        <el-form-item label="用户名:"
                      prop="username">
          <el-input v-model="loginForm.username"
                    prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码:"
                      prop="password">
          <el-input type="password"
                    v-model="loginForm.password"
                    prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登陆</el-button>
          <el-button type="success"
                     @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { async } from 'q'
export default {
  data() {
    return {
      //登陆表单的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '必须30-10位字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '必须30-10位字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //重置表单
    restLoginForm() {
      this.$refs.restLoginRef.resetFields()
    },
    login() {
      this.$refs.restLoginRef.validate(async valid => {
        if (!valid) return
        let { data: result } = await this.$http.post('login', this.loginForm)
        if (result.meta.status != 200)
          return this.$message.error(result.meta.msg)
        this.$message(result.meta.msg)
        window.sessionStorage.setItem('token', result.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.login_form {
  margin-top: 100px;
  margin-right: 20px;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
