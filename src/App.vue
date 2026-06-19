<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TheNavbar from '@/components/Core/TheNavbar.vue'
import TheFooter from '@/components/Core/TheFooter.vue'
import TheSidebar from '@/components/Core/TheSidebar.vue'

const route = useRoute()
const routeKey = computed(() => route.path)
const isJourney = computed(() => route.name === 'Journey')
</script>

<template>
  <TheNavbar />
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="routeKey" />
    </Transition>
  </router-view>
  <TheSidebar />
  <!-- Footer hidden on journey — the epilogue chapter serves as the ending -->
  <TheFooter v-if="!isJourney" />
</template>
