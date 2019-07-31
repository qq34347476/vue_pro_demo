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

      <el-alert title="只允许添加三级分类的参数"
                type="warning"
                show-icon>
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row type="flex"
              style="margin-top:20px">
        <el-col><span>选择商品分类:</span>
          <el-cascader v-model="currentCate"
                       :options="cateList"
                       clearable
                       :props="cascaderProps"
                       @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <template>
        <el-tabs v-model="activeName"
                 @tab-click="tabHandleClick">
          <!-- 动态 -->
          <el-tab-pane label="动态参数"
                       name="many">
            <el-button type="primary"
                       size="mini"
                       :disabled="isBtnDisabled"
                       @click="showDisabled">添加参数</el-button>
            <!-- 表格 -->
            <el-table :data="manyTabsLists"
                      border
                      style="width: 100%;margin-top:20px">
              <el-table-column prop="date"
                               type="expand"
                               width="48">
                <template slot-scope="scope">
                  <div>
                    <el-tag type="success"
                            closable
                            disable-transitions
                            @close="closeTap(index,scope.row)"
                            v-for="(item, index) in scope.row.attr_vals"
                            :key="index">{{ item }}</el-tag>
                    <!-- 新增小标签 -->
                    <el-input class="input-new-tag"
                              v-if="scope.row.inputVisible"
                              v-model="scope.row.inputValue"
                              ref="saveTagInput"
                              size="small"
                              style="width:120px"
                              @keyup.enter.native="handleInputConfirm(scope.row)"
                              @blur="handleInputConfirm(scope.row)">
                    </el-input>
                    <el-button v-else
                               class="button-new-tag"
                               size="small"
                               @click="showInput(scope.row)">+ New Tag</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name"
                               type="index"
                               width="48">
              </el-table-column>
              <el-table-column prop="attr_name"
                               label="参数名称">
              </el-table-column>
              <el-table-column prop="address"
                               label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="primary"
                               @click="editTab(scope.row)"
                               size="mini"
                               icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger"
                               icon="el-icon-delete"
                               size="mini">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 静态 -->
          <el-tab-pane label="静态属性"
                       name="only">
            <el-button type="primary"
                       size="mini"
                       @click="showDisabled"
                       :disabled="isBtnDisabled">添加属性</el-button>
            <!-- 表格 -->
            <el-table :data="onlyTabsLists"
                      border
                      style="width: 100%;margin-top:20px">
              <el-table-column prop="date"
                               type="expand"
                               width="48">
                <template slot-scope="scope">
                  <div>
                    <el-tag type="success"
                            closable
                            v-for="(item, index) in scope.row.attr_vals"
                            :key="index">{{ item }}</el-tag>
                    <!-- 新增小标签 -->
                    <el-input class="input-new-tag"
                              v-if="scope.row.inputVisible"
                              v-model="scope.row.inputValue"
                              ref="saveTagInput"
                              size="small"
                              style="width:120px"
                              @keyup.enter.native="handleInputConfirm(scope.row)"
                              @blur="handleInputConfirm(scope.row)">
                    </el-input>
                    <el-button v-else
                               class="button-new-tag"
                               size="small"
                               @click="showInput(scope.row)">+ New Tag</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name"
                               type="index"
                               width="48">
              </el-table-column>
              <el-table-column prop="attr_name"
                               label="参数名称">
              </el-table-column>
              <el-table-column prop="address"
                               label="操作">
                <template slot-scope="scope">
                  <div>
                    <el-button type="primary"
                               @click="editTab(scope.row)"
                               size="mini"
                               icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger"
                               icon="el-icon-delete"
                               size="mini">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>

    <!-- 添加动态属性 -->
    <el-dialog :title="'添加' + titleText"
               :visible.sync="dialogVisible"
               width="50%">
      <!-- form表单 -->
      <el-form ref="form"
               :model="form"
               :rules="addFormRules"
               label-width="100px">
        <el-form-item label="添加参数"
                      prop="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { truncate } from 'fs'
export default {
  data() {
    return {
      titleText: '动态属性',
      addFormRules: {
        value: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      },
      form: {
        value: ''
      },
      dialogVisible: false,
      cateList: [],
      currentCate: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //tabs
      activeName: 'many',
      manyTabsLists: [],
      onlyTabsLists: [],
      isEdit: false,
      edit: {}
    }
  },
  methods: {
    //关闭标签，删除
    closeTap(i, row) {
      row.attr_vals.splice(i, 1)
      this.changeTap(row)
    },
    //修改标签
    async changeTap(row) {
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
    },
    //tag按下
    async handleInputConfirm(row) {
      console.log(row)
      if (!row.inputValue.trim()) {
        row.inputVisible = false
        row.inputValue = ''
      }
      row.attr_vals.push(row.inputValue)
      this.changeTap(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    //tag点击
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    //编辑
    editTab(val) {
      if (this.activeName === 'many') {
        this.titleText = '动态参数'
      } else {
        this.titleText = '静态属性'
      }
      this.edit = val
      console.log(this.edit)

      this.form.value = this.edit.attr_name
      this.isEdit = true
      this.dialogVisible = true
    },
    //添加按钮
    async addCate() {
      if (this.isEdit) {
        const { data: res } = await this.$http.put(
          `categories/${this.currentCate[2]}/attributes/${this.edit.attr_id}`,
          { attr_name: this.form.value, attr_sel: this.activeName }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      } else {
        const { data: res } = await this.$http.post(
          `categories/${this.currentCate[2]}/attributes`,
          { attr_name: this.form.value, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      }
      this.handleChange()
      this.isEdit = false
      this.dialogVisible = false
      this.form.value = ''
    },
    //显示dielog
    showDisabled() {
      if (this.activeName === 'many') {
        this.titleText = '动态参数'
      } else {
        this.titleText = '静态属性'
      }
      this.dialogVisible = true
    },
    //点击标签的时候触发
    tabHandleClick() {
      this.handleChange()
    },
    async handleChange() {
      if (this.currentCate.length < 3) {
        return (this.currentCate = [])
      }
      let { data: res } = await this.$http.get(
        `categories/${this.currentCate[2]}/attributes`,
        { params: { sel: this.activeName } }
      )
      console.log(res, 111)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      if (this.activeName === 'many') {
        this.manyTabsLists = res.data
      } else {
        this.onlyTabsLists = res.data
      }
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //   this.$message.success(res.meta.msg)
      this.cateList = res.data
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    isBtnDisabled() {
      if (this.currentCate.length !== 3) return true
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
</style>
