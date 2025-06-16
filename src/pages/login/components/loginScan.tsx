import { defineComponent } from 'vue';
import MiniprogramCode from './miniprogramCode';

export default defineComponent({
  name: 'LoginScan',
  setup() {
    return () => {
      return <MiniprogramCode type="login" />;
    };
  },
});
