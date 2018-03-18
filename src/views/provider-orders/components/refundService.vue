<template>
    <Poptip placement="right" width="400">
        <Button type="ghost">click 激活</Button>
        <div class="api" slot="content">
            <table>
                <thead>
                    <tr>
                        <th>版本号</th>
                        <th>更新时间</th>
                        <th>说明</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>0.9.5</td>
                        <td>2016-10-26</td>
                        <td>新增信息提示组件 <code>Tooltip</code>和<code>Poptip</code></td>
                    </tr>
                    <tr>
                        <td>0.9.4</td>
                        <td>2016-10-25</td>
                        <td>新增对话框组件 <code>Modal</code></td>
                    </tr>
                    <tr>
                        <td>0.9.2</td>
                        <td>2016-09-28</td>
                        <td>新增选择器组件 <code>Select</code></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Poptip>
</template>
<script>
    export default {
        
    }
</script>