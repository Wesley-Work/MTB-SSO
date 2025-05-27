import { api } from '../config';

interface RequestHooksOptions {
  url: string;
  token?: string;
  methods?: string;
  header?: object;
  data?: object | string;
  useCustomURL?: boolean;
  timeout?: number;
  success?: Function;
  error?: Function;
  complete?: Function;
}

interface RequestResponseData {
  errcode: number | string;
  errmsg: string;
  data?: string | Array<any> | object | null;
}

function SpliceParameter(DATA: Object) {
  if (Object.prototype.toString.call(DATA) !== '[object Object]') return false;
  // PASS
  const ParameterOBJ = [];
  for (const [key, value] of Object.entries(DATA)) {
    const keys = encodeURIComponent(key);
    const values = value === null ? '' : encodeURIComponent(value);
    ParameterOBJ.push(`${keys}=${values}`);
  }
  const ParameterSRT = ParameterOBJ.join('&');
  return ParameterSRT;
}

/**
 * 请求后端公共方法
 * 支持传入方法或Promise形式获取结果
 * @useRequest
 * @param option
 * @returns Promise
 * @example
 * useRequest({
 *  url: URL,
 *  methods: METHODS,
 *  header: object,
 *  data: object,
 *  success: function,
 *  error: function,
 * })
 *
 */
export function useRequest(option: RequestHooksOptions) {
  return new Promise<Boolean | string>(async (resolve, reject) => {
    try {
      function emitComplete(res) {
        if (option.complete && typeof option.complete === 'function') {
          option.complete(res);
        }
      }
      function emitError(et, res) {
        if (option.error && typeof option.error === 'function') {
          option.error(res);
        }
        console.error(et, res);
        emitComplete(res);
        reject(res);
      }
      function emitSuccess(res: RequestResponseData) {
        if (option.success && typeof option.success === 'function') {
          option.success(res);
        }
        emitComplete(res);
        resolve(JSON.stringify(res));
      }
      if (Object.prototype.toString.call(option) !== '[object Object]') {
        resolve(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        emitError('token不存在', null);
        resolve(false);
        return;
      }
      // fetch 请求
      await fetch(option?.useCustomURL ? option?.url : `${api}${option?.url}`, {
        method: option?.methods ? option?.methods.toUpperCase() : 'GET',
        headers: {
          ...option?.header,
          token: token,
          'Content-Type':
            (option?.header as any)?.['Content-Type'] ?? 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: SpliceParameter(option?.data ?? '') || null,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then((data) => {
          emitSuccess(data);
        })
        .catch((err) => {
          emitError('RequestError', err);
        })
        .finally(() => {});
    } catch (e) {
      console.error('XHR Module Error: ', e);
    }
  });
}

export default useRequest;
