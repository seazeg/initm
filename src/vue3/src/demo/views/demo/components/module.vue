<!--
 * @Author       : Evan.G
 * @Date         : 2022-01-19 15:20:34
 * @LastEditTime : 2022-01-19 15:24:18
 * @Description  : 
-->
<template>
    <div>{{ title }}</div>
</template>

<script>
export default {
    name: "module",
    props: {
        title: {
            type: String,
            default: "模块1",
        },
    },
    setup() {},
};
</script>

<style lang="less" scoped></style>
