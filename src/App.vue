<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute()
const routeKey = computed(() => route.path)
const isJourney = computed(() => route.name === 'Journey')
</script>

<template>
  <!-- Journey owns its own sidebar nav (progress rail) — no top header there -->
  <TheNavbar v-if="!isJourney" />
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="routeKey" />
    </Transition>
  </router-view>
  <!-- Footer hidden on journey — the epilogue chapter serves as the ending -->
  <TheFooter v-if="!isJourney" />
</template>
