<template>
  <div class="home">
    <HelloHeader />
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloHeader from '@/components/HelloHeader.vue'

export default {
  name: 'Home',
  components: {
    HelloHeader
  }
}
</script>
