<style lang="less">
    @import './login.less';
</style>

<template>
	<!-- 此处@keydown.enter的原理是dom元素的事件冒泡 -->
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import * as userLogin from "../api/provider/provider-user";
export default {
    data () {
        return {
            form: {
                userName: 'operatorTest',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    userLogin.login.r({username:this.form.userName,password:this.form.password}).then(res => {    
                        Cookies.set('user', this.form.userName);
                        Cookies.set('password', this.form.password);
                        this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        Cookies.set('access', res.data.urls);
                        // userLogin.login登陆请求到后台，后台传递参数到前台，参数包括userName、password、登陆用户的urls
                        // 然后前台跳转到home_index页面
                        this.$router.push({
                            name: 'home_index'
                        });
                    });
                }
            });
        }
    }
};

</script>

<style>

</style>
