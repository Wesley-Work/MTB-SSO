<template>
  <div class="session-container sign-in-box">
    <div class="session">
      <!---->
      <HeadLogo />
      <!---->
      <LoginView v-bind="props" />
      <!---->
    </div>
  </div>
</template>

<script setup lang="tsx">
import { componentProps } from '../../props';
import LoginView from './components/loginView';
import HeadLogo from '@/components/headLogo.tsx';

const props = defineProps(componentProps);
</script>

<script lang="tsx">
export default {
  name: 'Login',
};
</script>
