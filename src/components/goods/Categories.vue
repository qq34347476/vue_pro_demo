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
      <el-button type="primary">添加分类</el-button>
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

  </div>
</template>

<script>
export default {
  data() {
    return {
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
      ]
    }
  },
  methods: {
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
