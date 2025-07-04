<script setup lang="ts"></script>

<template>
  <div class="footer">
    <div class="footer-content">
      <a href="tel:0912002098" class="footer-icon">
        <img src="/icons/phone.png" alt="Phone" width="24" />
      </a>

      <a href="https://line.me/ti/p/~nokil1141" class="footer-icon">
        <img src="/icons/line.png" alt="LINE" width="24" />
      </a>

      <a href="https://www.facebook.com/share/1A5wbMQmc5/?mibextid=wwXIfr" class="footer-icon" target="_blank">
        <img src="/icons/facebook.png" alt="Facebook" width="24" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.footer {
  position: fixed;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  background-image: url('/imgs/microcement--bg.jpg'); /* 使用微水泥紋理圖片 */
  background-size: cover; /* 確保背景圖片覆蓋整個容器 */
  background-repeat: no-repeat; /* 不重複背景圖片 */
  background-attachment: fixed; /* 固定背景 */
}
.footer-content {
  display: flex;
  justify-content: center;
}
.footer-icon {
  cursor: pointer;
  margin: 10px;
}
</style>
