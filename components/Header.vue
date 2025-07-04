<script setup lang="ts"></script>

<template>
  <div class="header">
    <div class="header-content">
      <nuxt-link to="/" class="header-logo">
        <img src="/icons/GD-Photoroom.png" alt="logo" height="60px" />
      </nuxt-link>
      <ul class="header-item">
        <nuxt-link to="/AboutUs" class="no-decoration">
          <li class="header-item-text">關於我們</li>
        </nuxt-link>
        <!-- <li class="header-item-text">服務項目</li> -->
        <!-- <li class="header-item-text">裝潢作品</li> -->
        <!-- <li class="header-item-text">聯絡我們</li> -->
      </ul>
    </div>
  </div>
</template>

<style scoped>
.header {
  background-image: url('/imgs/microcement--bg.jpg'); /* 使用微水泥紋理圖片 */
  background-size: cover; /* 確保背景圖片覆蓋整個容器 */
  /* background-position: center;  */
  background-repeat: no-repeat; /* 不重複背景圖片 */
  background-attachment: fixed; /* 固定背景 */
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.header-content {
  width: 1024px;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}
.header-logo {
  cursor: pointer;
}
.header-item {
  display: flex;
  align-items: center;
}
.no-decoration {
  text-decoration: none;
}
.header-item-text {
  margin-left: 20px;
  font-size: 16px;
  cursor: pointer;
  color: black;
}
</style>
