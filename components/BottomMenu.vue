<script setup lang="ts">

</script>

<template>
  <footer class="footer">
<!--    <MapsFooter />-->
    <div class="container">
      <p class="text-center text-muted">
        &copy; {{ new Date().getFullYear() }} - Test Project
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #aeb1b5;
  padding: 1rem 0;
  margin-top: 2rem;
  z-index: 1002;
  position: fixed;
  bottom: 0;
  width: 100%;
}

</style>