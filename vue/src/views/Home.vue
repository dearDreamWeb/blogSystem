<template>
  <div class="home">
    <!-- 头部 -->
    <v-header></v-header>
    <div class="container"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "../components/Header";

export default {
  name: "Home",
  components: {
    vHeader: Header
  }
};
</script>

<style lang="scss" scoped>
@import "../common/styles";
.home {
  .container {
    margin: 0 auto;
    width: 60%;
    background-color: $div_bgColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    padding: 1rem;
  }
}
</style>
