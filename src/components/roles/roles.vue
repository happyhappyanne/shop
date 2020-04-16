<template>
  <div>
    <!-- 面包屑导航 -->
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="1">
          <el-button type="primary"
                     @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList"
                stripe
                style="width: 100%"
                border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item, i1) in scope.row.children"
                    :key="item.id"
                    :class="['bd-bottom', i1 === 0 ? 'db-top' : '', 'v-center']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRight(scope.row.id, item.id)">
                  {{ item.authName }}
                </el-tag>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <el-row v-for="(subItem, i2) in item.children"
                        :key="subItem.id"
                        :class="['v-center', i2 === 0 ? '' : 'bd-top']">
                  <el-col :span="6">
                    <el-tag closable
                            type="success"
                            @close="removeRight(scope.row.id, subItem.id)">{{ subItem.authName }}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            closable
                            v-for="third in subItem.children"
                            :key="third.id"
                            @close="removeRight(scope.row.id, third.id)">{{ third.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         label="#"> </el-table-column>
        <el-table-column prop="roleName"
                         label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc"
                         label="角色描述"> </el-table-column>
        <el-table-column label="操作"
                         width="300">
          <template slot-scope="scope">
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"
                       @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning"
                       icon="el-icon-s-tools"
                       size="mini"
                       @click="roleTreeVisible=true">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加角色"
               :visible.sync="dialogVisible"
               @close="resetField">
      <el-form ref="addRole"
               :model="role"
               label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色"
               :visible.sync="editeditDialogVisible"
               @close="resetEditField">
      <el-form ref="editRole"
               :model="role"
               label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editeditDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限树形控件 -->
    <el-dialog title="分配权限"
               :visible.sync="roleTreeVisible">
      <!-- 树形控件 -->
      <el-tree :data="rolesList"
               show-checkbox
               node-key="id"
               :default-expanded-keys="[2, 3]"
               :default-checked-keys="[5]"
               :props="defaultProps">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click=" roleTreeVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="roleTreeVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      // 添加用户弹窗
      dialogVisible: false,
      // 编辑用户弹窗
      editeditDialogVisible: false,
      // 添加用户
      role: {
        roleName: '',
        roleDesc: ''
      },
      // 权限树形控件配置
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 权限树形控件配置 显示状态
      roleTreeVisible: false
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    // 删除角色
    async deleteRole (id) {
      console.log(id)
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    // 添加角色
    async addRole () {
      this.dialogVisible = false
      const { data: res } = await this.$http.post('roles', this.role)
      if (res.meta.status !== 201) return this.$message.error('添加角色失败')
      this.$message.success('添加角色成功')
      this.getRolesList()
      this.resetFields()
    },
    // 重置添加角色表单
    resetField () {
      // console.log(this.$refs.addRole.resetFields())
      this.$refs.addRole.resetFields()
    },
    // 删除权限
    async removeRight (roleId, rightId) {
      const { data: res } = await this.$http.delete(
        `roles/${roleId}/rights/${rightId}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      this.$message.success('删除角色权限成功')
      this.getRolesList()
    },
    // 编辑角色
    async editRole () {
      // console.log(this.role.id)
      const { data: res } = await this.$http.put(
        `roles/${this.role.id}`,
        this.role
      )
      if (res.meta.status !== 200) return this.$message.error('编辑角色失败')
      this.$message.success('编辑角色成功')
      this.editeditDialogVisible = false
      this.resetEditField()
      this.getRolesList()
    },
    // 显示编辑对话框
    showEditDialog (role) {
      this.editeditDialogVisible = true
      this.role = role
    },
    // 重置编辑弹窗
    resetEditField () {
      this.$refs.editRole.resetFields()
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.v-center {
  display: flex;
  align-items: center;
}
.bd-top {
  border-top: 1px solid #eee;
}
</style>
