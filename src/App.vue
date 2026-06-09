<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()
const routeKey = computed(() => route.path)
</script>

<template>
  <TheNavbar />
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="routeKey" />
    </Transition>
  </router-view>
  <TheFooter />
</template>
