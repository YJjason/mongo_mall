<template>
    <div>
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <!--<span>Goods</span>-->
        <!--共同组建 ，使用slot  插槽匹配-->
        <slot></slot>
      </nav>
    </div>
</template>

<script>
    export default {
        name: "NavBread"
    }
</script>

<style scoped>

</style>
