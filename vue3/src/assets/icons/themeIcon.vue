<template>
    <img :src="isDark ? themeIcon2 :themeIcon1" alt="">
</template>
<script setup lang="ts">
import themeIcon1 from './theme1.svg'
import themeIcon2 from './theme2.svg'
import useTheme from '@/stores/useTheme.ts'
import { storeToRefs } from 'pinia'
const {isDark} = storeToRefs(useTheme())
</script>
<style scoped>
img{
  width: 20px;
}
</style>
