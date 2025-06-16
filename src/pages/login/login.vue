<template>
  <div class="session-container sign-in-box">
    <div class="session">
      <!---->
      <div class="session-logo">
        <img src="../../assets/fhzsn_white.png" />
      </div>
      <!---->
      <loginView v-bind="props" />
      <!---->
    </div>
  </div>
</template>

<script setup lang="tsx">
import { componentProps } from '../../props';
import loginView from './components/loginView';

const props = defineProps(componentProps);
</script>

<script lang="tsx">
export default {
  name: 'Login',
};
</script>
