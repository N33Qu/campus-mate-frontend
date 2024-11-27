<script setup>
import Navbar from "@/components/Navbar.vue";
const name = 'John Doe'
const status = true
import {RouterView} from "vue-router";
</script>

<template>
  <Navbar/>
  <RouterView/>
</template>

