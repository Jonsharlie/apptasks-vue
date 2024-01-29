<template>
  <ListTasks/>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import ListTasks from "./components/ListTasks.vue";

  export default defineComponent({
    name: "App",
    components: {
      ListTasks
    }
  })
</script>

<style scoped>
</style>
