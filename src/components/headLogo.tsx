import { defineComponent } from 'vue';

import mtb from '../assets/mtb-logo.png';
import fhzsn from '../assets/fhzsn_white.png';

export default defineComponent({
  name: 'HeadLogo',
  setup() {
    return () => {
      return (
        <div class="session-logo">
          <img class="mtb" src={mtb} />
          <img class="fhzsn" src={fhzsn} />
        </div>
      );
    };
  },
});
