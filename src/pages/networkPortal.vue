<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  router.push({
    path: '/login',
    query: {
      ...route.query,
      actionType: 'NetworkPortal',
    },
  });
  // setTimeout(() => {
  //   location.reload();
  // }, 100);
});
</script>

<script lang="ts">
export default {
  name: 'NetworkPortal',
};
</script>
