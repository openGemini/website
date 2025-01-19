<template>
    <footer class="cncf">
        <div class="container">
            <div class="content">
                openGemini is a
                <a href="https://www.cncf.io/" target="_blank">Cloud Native Computing Foundation</a>
                sandbox project.
            </div>
            <div class="logo">
                <img v-if="isDark == isDarkTheme" src="@/assets/images/cncf-white.svg" alt=""/>
                <img v-else src="@/assets/images/cncf-color.svg" alt=""/>
            </div>
            <p class="copyright">
                The Linux Foundation has registered trademarks and uses trademarks. For a list of
                trademarks of The Linux Foundation, please see our
                <a href="https://www.linuxfoundation.org/legal/trademark-usage" target="_blank"
                    >Trademark Usage</a
                >
                page. 2025 © openGemini Project Authors. All rights reserved.
            </p>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import {isDark, isDarkTheme} from "@/components/composables";
</script>

<style lang="less" scoped>
.cncf {
    padding: 5rem 40px 2rem;

    .container {
        margin: 0 auto;
        max-width: 1200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem;
    }
    .content {
        font-size: 18px;
        text-align: center;
    }
    .logo {
        width: 100%;
        max-width: 495px;
        height: 100px;

        img {
            width: 100%;
        }
    }
    .copyright {
        font-size: 14px;
        text-align: center;
    }
}
</style>
