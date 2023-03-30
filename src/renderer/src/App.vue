<script setup lang="ts">
import { onMounted, ComponentInternalInstance, getCurrentInstance, provide } from 'vue'
import { router } from './router'

const app = (getCurrentInstance() as ComponentInternalInstance).appContext.config.globalProperties
provide('router', app.$router)

onMounted(() => {
  router.push({ path: '/sign-in' })
})
</script>

<template>
  <layout>
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath" />
    </router-view>
  </layout>
</template>

<style lang="css">
@import './assets/css/global.scss';
</style>
