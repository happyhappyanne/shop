<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query">
            <template slot="append">
              <el-button slot="append"
                         icon="el-icon-search"
                         @click="searchGoods"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary"
                     @click="goAddGood">添加商品
          </el-button>
        </el-col>
      </el-row>

      <!-- 商品列表 -->
      <el-table :data="goods"
                stripe
                style="width: 100%"
                border>
        <el-table-column label="#"
                         type="index">
        </el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称"
                         width="180">
        </el-table-column>
        <el-table-column prop="goods_price"
                         label="价格"
                         width="180">
        </el-table-column>
        <el-table-column prop="goods_weight"
                         label="重量">
        </el-table-column>
        <el-table-column prop="add_time"
                         label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      goods: [],
      // 商品总数
      total: 0,
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页码
        pagesize: 5// 每页显示的商品条数
      }

    }
  },
  methods: {
    // 获取商品列表
    async getGoods () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) this.$message.error('获取商品列表失败')
      this.total = res.data.total
      this.goods = res.data.goods
      console.log(this.goods)
    },
    // 改变页面显示数量
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getGoods()
    },
    // 改变当前页
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getGoods()
    },
    // 搜索商品
    searchGoods () {
      this.getGoods()
    },
    // 进入添加商品组件
    goAddGood () {
      this.$router.push('/goods/add')
    }
  },
  mounted () {
    console.log('created')
    this.getGoods()
  }
}
</script>
<style lang="less" scoped>
</style>
