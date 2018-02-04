<template>
        <Modal title="新增" v-model="modalPost" @on-ok="ok" class-name="vertical-center-modal">
          
          <Form :model="formItem" :label-width="80">
              <FormItem label="账号">
                  <Input v-model="formItem.name" placeholder="Enter something..."></Input>
              </FormItem>
              <FormItem label="密码">
                  <Input type="password" v-model="formItem.password" placeholder="请输入密码">
                      <span slot="prepend">
                          <Icon :size="14" type="locked"></Icon>
                      </span>
                  </Input>
              </FormItem>
              <FormItem label="角色">
                  <Select v-model="formItem.roleId">
                      <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.rolesName }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="联系电话">
                  <Input v-model="formItem.tel" placeholder="Enter something..."></Input>
              </FormItem>
          </Form>
        </Modal>
</template>

<script>
export default {
    name: 'postForm',
    props: {
        modalPost: Boolean,
        roles:Array
    },
    data () {
        return {
            formItem:{"name":"","password":"","roleId":"","tel":"","status":1}
        };
    },
        methods: {
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
        }
};
</script>
