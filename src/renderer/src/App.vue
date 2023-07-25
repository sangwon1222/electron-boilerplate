<script setup lang="ts" scoped>
import { onMounted, ComponentInternalInstance, getCurrentInstance, provide } from 'vue'
import { router } from './router'
import { loadingStore } from '@store/loading'
import tLoading from '@template/loading/tLoading.vue'

const app = (getCurrentInstance() as ComponentInternalInstance).appContext.config.globalProperties
provide('router', app.$router)

onMounted(() => {
  loadingStore.isLoading = true
  setTimeout(() => (loadingStore.isLoading = false), 1000)
})
</script>

<template>
  <div>
    <t-loading v-if="loadingStore.isLoading" />
    <layout>
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath" />
      </router-view>
    </layout>
  </div>
</template>

<style lang="css">
@import './assets/css/global.scss';
</style>
