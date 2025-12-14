import { defineComponent, ref, toRefs } from 'vue';
import MiniprogramCode from './scan/miniprogramCode';
import WecomCode from './scan/wecomCode';
import { componentProps } from '../../../props';
import { RadioButton, RadioGroup } from 'tdesign-vue-next';
// import { LogoWecomIcon } from 'tdesign-icons-vue-next';
import wecomLogo from '../../../assets/wecom.svg';
import miniprogramLogo from '../../../assets/miniprogram.svg';

export default defineComponent({
  name: 'LoginScan',
  props: {
    ...componentProps,
  },
  setup(props) {
    const scanType = ref('wecom');
    return () => {
      return (
        <>
          <div style="padding: 12px 0px 16px;display: flex;justify-content: center;">
            <RadioGroup variant="default-filled" v-model:value={scanType.value}>
              <RadioButton value="wecom">
                {/* <LogoWecomIcon style={{ marginRight: '8px' }} /> */}
                <div style="display: flex;align-items: center;">
                  <img src={wecomLogo} alt="企业微信" style={{ marginRight: '8px', width: '16px', height: '16px' }} />
                  企业微信
                </div>
              </RadioButton>
              <RadioButton value="miniprogram">
                <div style="display: flex;align-items: center;">
                  <img
                    src={miniprogramLogo}
                    alt="小程序"
                    style={{ marginRight: '8px', width: '16px', height: '16px' }}
                  />
                  小程序登录
                </div>
              </RadioButton>
            </RadioGroup>
          </div>
          {scanType.value === 'wecom' ? <WecomCode {...props} /> : null}
          {scanType.value === 'miniprogram' ? <MiniprogramCode type="login" {...props} /> : null}
        </>
      );
    };
  },
});
