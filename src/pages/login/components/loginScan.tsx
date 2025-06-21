import { defineComponent, toRefs } from 'vue';
import MiniprogramCode from './miniprogramCode';
import { componentProps } from '../../../props';

export default defineComponent({
  name: 'LoginScan',
  props: {
    ...componentProps,
  },
  setup(props) {
    return () => {
      return <MiniprogramCode type="login" {...props} />;
    };
  },
});
