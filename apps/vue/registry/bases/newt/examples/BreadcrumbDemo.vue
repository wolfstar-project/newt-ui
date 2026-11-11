<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
} from "~~/registry/bases/newt/ui/breadcrumb"
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem href="#">Server settings</BreadcrumbItem>
    <BreadcrumbItem href="#">Roles</BreadcrumbItem>
    <BreadcrumbItem current>Moderator</BreadcrumbItem>
  </Breadcrumb>
</template>
