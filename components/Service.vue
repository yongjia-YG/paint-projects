<template>
  <div class="service">
    <div class="service-title">服務項目</div>
    <div class="divider"></div>
    <div class="service-list">
      <div class="service-item">統包工程 ● 藝術塗料</div>
      <div class="service-item">防水工程 ● 室內油漆</div>
      <div class="service-item">外牆防水 ● <span class="service-item-spacing">仿石漆</span></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.service {
  max-width: 1024px;
  margin: 0 auto;
  padding: 10px 20px;
  padding-top: 120px;
}
.service-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 20px;
}
.divider {
  border-bottom: 4px double #000;
  width: 300px;
  margin: 10px auto;
}
.service-list {
  display: grid;
  gap: 10px;
  text-align: center;
  font-size: 20px;
  margin-top: 10px;
}
.service-item-spacing {
  letter-spacing: 6px;
}
</style>
