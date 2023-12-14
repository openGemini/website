<template>
    <el-popover placement="top" trigger="hover" :width="240" :teleported="false">
        <template #reference>
            <slot />
        </template>
        <div class="wechat-qr">
            <img src="@/assets/images/wechat-qrcode.jpg" alt="" />
            <h3>openGemini</h3>
            <span>微信扫一扫 关注我们</span>
        </div>
    </el-popover>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.wechat-qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    > img {
        width: 200px;
    }
    h3 {
        color: @font-color-2;
    }
    span {
        font-size: 12px;
        color: gray;
    }
}
</style>
