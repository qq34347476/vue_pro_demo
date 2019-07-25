<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
            <el-button type="info">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <template>
        <el-table :data="goods"
                  border
                  style="width: 100%;margin-bottom:20px">
          <el-table-column type="index"
                           width="48">
          </el-table-column>
          <el-table-column prop="goods_name"
                           label="商品名称"
                           min-width="815">
          </el-table-column>
          <el-table-column prop="goods_price"
                           label="商品价格(元)">
          </el-table-column>
          <el-table-column prop="goods_weight"
                           label="商品重量">
          </el-table-column>
          <el-table-column prop="add_time"
                           label="创建时间">
          </el-table-column>
          <el-table-column label="操作"
                           width="180">

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
                     :total="total"
                     background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { isNumber } from 'util'
export default {
  data() {
    return {
      search: '',
      getListParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goods: [],
      total: 1
    }
  },
  methods: {
    addUser() {
      console.log(1)
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.getListParams
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.goods = res.data.goods
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
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.el-table-column {
  font-size: 12px;
  height: 48px;
}
</style>
