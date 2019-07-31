<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card"
             style="margin-top:10px">
      <!-- 警告框 -->
      <el-alert type="warning"
                center
                show-icon
                title="添加商品信息"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200"
                style="margin-top:20px"
                :active="activeIndex - 0"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs -->
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-position="top"
               label-width="100px">
        <el-tabs tab-position="left"
                 v-model="activeIndex"
                 :before-leave="changeTabs"
                 style="margin-top: 20px">
          <el-tab-pane label="基本信息"
                       name="0">
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input type="number"
                        v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input type="number"
                        v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input type="number"
                        v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader v-model="addForm.goods_cat"
                           :options="goodsList"
                           clearable
                           expand-trigger="hover"
                           :props="cascaderProps"
                           @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1"
                       label="商品参数">商品参数</el-tab-pane>
          <el-tab-pane name="2"
                       label="商品属性">商品属性</el-tab-pane>
          <el-tab-pane name="3"
                       label="商品图片">商品图片</el-tab-pane>
          <el-tab-pane name="4"
                       label="商品内容">商品内容</el-tab-pane>
          <el-tab-pane name="5"
                       label="完成">完成</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      goodsList: [],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      },
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  methods: {
    //切换tabs
    changeTabs(activeName, oldName) {
      if (oldName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择三级分类')
        this.addForm.goods_cat = []
        return false
      }
    },
    //选中分类后触发
    handleChange() {
      console.log(this.addForm.goods_cat)
    },
    //获取商品分类
    async getGoodsList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data
      console.log(this.goodsList)
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>
