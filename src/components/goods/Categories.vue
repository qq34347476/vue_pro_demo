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
      <el-button type="primary"
                 @click="showCateDialog">添加分类</el-button>
      <trae-table class="treeTable"
                  style="margin-top:20px"
                  ref="table"
                  show-index
                  index-text="#"
                  show-header
                  :data="cateList"
                  :columns="treeColumns"
                  border
                  :selection-type="false"
                  :expand-type="false">
        <!-- 是否有效 -->
        <template slot="isok"
                  slot-scope="scope">
          <div>
            <i class="el-icon-success"
               v-if="scope.row.cat_deleted === false"
               style="color: #67C23A; font-size: 20px"></i>
            <i class="el-icon-error"
               v-if="scope.row.cat_deleted === true"
               style="font-size: 20px"></i>
          </div>
        </template>
        <!-- 排序 -->
        <template slot="level"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level==1"
                  type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level==2"
                  type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="doing"
                  slot-scope="scope">
          <div>
            <el-button type="primary"
                       size="mini"><i class="el-icon-edit"></i>编辑</el-button>
            <el-button type="danger"
                       size="mini"><i class="el-icon-delete"></i>删除</el-button>
          </div>
        </template>
      </trae-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     style="margin-top:20px">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               width="50%">

      <el-form ref="addCateformRef"
               :rules="addCateRules"
               :model="addCate"
               label-width="100px">
        <el-form-item label="分类名称: "
                      prop="cat_name">
          <el-input v-model="addCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <el-cascader v-model="cascader"
                       :options="cateOptions"
                       :props="cascaderProps"
                       expand-trigger="hover"
                       change-on-select
                       @change="parentCateChanged"
                       clearable></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addCateAjax">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateDialogVisible: false, //控制分类对话框
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      treeColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template', //当前列定义为模板列
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'doing'
        }
      ],
      //添加分类
      addCate: {
        cat_name: '',
        parentCate: ''
      },
      addCateRules: {
        cat_name: { required: true, message: '请输入分类内容', trigger: 'blur' }
      },
      cascader: [], //选中的
      cateOptions: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addParams: {}
    }
  },
  methods: {
    //添加分类
    addCateAjax() {
      this.$refs.addCateformRef.validate(async valid => {
        if (!valid) return
        this.addParams.cat_name = this.addCate.cat_name
        if (this.cascader.length === 0) {
          this.addParams.cat_pid = 0 //父id
          this.addParams.cat_level = 0
        } else if (this.cascader.length > 0) {
          this.addParams.cat_pid = this.cascader[1]
          this.addParams.cat_level = this.cascader.length
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addParams
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
      })

      this.addCateDialogVisible = false
    },
    parentCateChanged(ids) {
      console.log(this.addCate, ids, this.cascader)
    },
    //添加分类
    async showCateDialog() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateOptions = res.data
      this.addCateDialogVisible = true
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    //获取列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
</style>
