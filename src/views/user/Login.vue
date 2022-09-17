<template>
  <div>
    <div class="back">
      <el-form
        class="form"
        label-position="left"
        :model="form"
        :rules="rules"
        ref="form"
      >
        <p class="title">Welcome</p>
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入管理员账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入管理员密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="onSubmit()"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          {
            pattern: /^\w{3,15}$/,
            message: "3~15位字符，可以包含：数字、字母、下划线",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请填写用户名", trigger: "blur" },
          {
            pattern: /^\w{6,15}$/,
            message: "6~15位字符，可以包含：数字、字母、下划线",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    onSubmit() {
      // 验证登录表单
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.http.AdminApi.login(this.form).then(res=>{
            console.log("登录请求", res)
            if(res.data.code==200){
              // 将用户信息存入vuex
              this.$store.commit('saveUserState', res.data.data)
              this.$router.push('/')
            }else if(res.data.code==1001){
              this.$message.error('账号密码输入错误，请重新输入')
              this.form.username = ''
              this.form.password = ''
            }
          })
        }else{
          this.$message.warning('表单填写有误，请重新填写')
        }
      });
    },
  },
};
</script>

<style scoped>
.form {
  display: block;
  width: 20%;
  position: absolute;
  top: 30%;
  left: 40%;
}
.form .title {
  text-align: center;
  font-size: 1.5em;
  color: white;
  margin-bottom: 20px;
}
.back {
  height: 100vh;
  background-image: linear-gradient(125deg, #e14040, #b050cd, #4842c9, #34828d);
  background-size: 500%;
  animation: animate 20s infinite;
}
@keyframes animate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
