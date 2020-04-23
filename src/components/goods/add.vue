<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="添加商品信息"
            type="info"
            show-icon
            center
            :closable="false"
          >
          </el-alert>
        </el-col>
      </el-row>

      <!-- 步骤条 -->
      <el-row>
        <el-col>
          <el-steps
            :active="active - 0"
            finish-status="success"
            align-center
            :space="200"
          >
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="商品完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>

      <!-- 添加面板 -->
      <el-form
        ref="addForm"
        :rules="addFormRules"
        :model="goodsInfo"
        class="demo-ruleForm"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="currentPanel"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="goodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="goodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="goodsInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsInfo.goods_cat"
                :options="catList"
                :props="catProps"
                @change="handleChange"
                expand-trigger="hover"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 动态参数 -->
          <el-tab-pane label="商品参数">
            <el-form-item
              :label="item.attr_name"
              v-for="item in attrCheckList"
              :key="item.attr_id"
            >
              <el-checkbox-group
                v-model="item.attr_vals"
                @change="getChangeAttr"
              >
                <el-checkbox
                  :label="item1"
                  border
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性 -->
          <el-tab-pane label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in attrOnlyList"
              :key="item.attr_id"
              v-model="goodsInfo.attr"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="header"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="goodsInfo.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 上传图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialog">
      <img :src="previewPath" class="preview-img" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 步骤条开始状态
      active: 0,
      // 添加表单校验规则
      addFormRules: {
        goods_name: {
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        },
        goods_price: {
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        },
        goods_number: {
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        },
        goods_weight: {
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }
      },
      // 添加的商品信息
      goodsInfo: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      catList: [],
      // 级联菜单
      catProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 参数列表
      attrCheckList: {},
      // 静态参数
      attrOnlyList: [],
      // 上传图片地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片列表
      fileList: [],
      // 上传图片请求头
      header: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览上传图片地址
      previewPath: '',
      previewDialog: false
    }
  },
  methods: {
    handleChange() {
      // console.log('ok')
      // console.log(this.goodsInfo.goods_cat)
      if (this.goodsInfo.goods_cat.length !== 3) {
        this.goodsInfo.goods_cat = []
      }
    },
    // 获取商品分类
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      // console.log(1)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败')
      this.catList = res.data
      console.dir(this.catList)
    },
    // 当前的面板
    currentPanel(current) {
      // console.log(this.active)
      // this.active = parseInt(current.index)
      if (current.index === '1') {
        this.getManyAttr(this.cateId)
      } else if (current.index === '2') {
        this.getOnlyAttr(this.cateId)
      }
    },
    // 切换面板之前校验
    beforeLeave(activeName, oldActiveName) {
      // console.log(oldActiveName)
      // console.log('即将离开的标签页名字是：' + oldActiveName)
      // console.log('即将进入的标签页名字是：' + activeName)
      if (oldActiveName === '0' && this.goodsInfo.goods_cat.length !== 3) {
        this.$message.error('请选择分类')
        return false
      }
      this.active = parseInt(activeName)
    },
    // 获取动态参数
    async getManyAttr(id) {
      const { data: res } = await this.$http.get(
        `categories/${id}/attributes`,
        {
          params: {
            sel: 'many'
          }
        }
      )
      // console.log(res.data[0].attr_vals)
      res.data.forEach(item => {
        item.attr_vals =
          item.attr_vals.length !== 0 ? item.attr_vals.split(',') : []
      })
      this.attrCheckList = res.data
    },
    // 获取静态参数
    async getOnlyAttr(id) {
      const { data: res } = await this.$http.get(
        `categories/${id}/attributes`,
        {
          params: {
            sel: 'only'
          }
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数错误')
      }
      this.attrOnlyList = res.data
    },
    // 选中的属性
    getChangeAttr(attr) {
      // console.log(attr)
      this.goodsInfo.attrs = attr
    },
    // 预览上传图片
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      console.log(this.previewPath)
      this.previewDialog = true
    },
    handleRemove(file) {
      // console.log(1)
      var tem = file.response.data.tmp_path
      var index = this.goodsInfo.pics.indexOf(tem)
      this.goodsInfo.pics.splice(index, 1)
      console.log(2)
      console.log(this.goodsInfo)
    },
    // 上传列表变化时
    uploadSuccess(response) {
      // console.log(fileList)
      const picInfo = { pics: response.data.tmp_path }
      this.goodsInfo.pics.push(picInfo)
    },
    // 添加商品
    async addGoods() {
      this.goodsInfo.goods_cat = this.goodsInfo.goods_cat.join(',')
      console.log(this.goodsInfo)
      const { data: res } = await this.$http.post('goods', this.goodsInfo)
      console.log(res)
      if (res.meta.status !== 201) return this.$message.error('添加商品失败')
      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    }
  },
  created() {
    this.getCategories()
  },
  computed: {
    cateId() {
      if (this.goodsInfo.goods_cat.length === 3) {
        return this.goodsInfo.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  margin-top: 10px;
}
.el-card {
  height: 100%;
}
.el-tabs--left {
  height: 100% !important;
}
.el-form--label-top .el-form-item__label {
  float: left !important;
  color: red;
}
.el-checkbox {
  margin: 0 10px 5px 0 !important;
}
.preview-img {
  width: 100%;
}
// .quill-editor {
//   height: 300px;
// }
.el-button {
  margin-top: 10px !important;
}
</style>
