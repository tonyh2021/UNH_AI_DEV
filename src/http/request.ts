import axios from 'axios';

export const initHttpConfig = () => {
  axios.defaults.timeout = 15000;
};

/**
 * http request interceptors
 */
axios.interceptors.request.use(
  async config => {
    const url = config.url;
    console.info('API request url -->', url);
    console.info('API request params --> ', config.params);
    console.info('API request headers --> ', config.headers);
    return config;
  },
  error => {
    const url = error.config.url;
    const params = error.config.data;
    console.warn('API error url -->', url);
    console.warn('API error params --> ', params);
    console.warn('API error data -->', error);

    return Promise.reject(error);
  },
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  response => {
    const url = response.config.url;
    const params = response.config.data;

    console.info('API response url -->', url);
    console.info('API response params --> ', params);
    console.info('API response', JSON.stringify(response.data));
    return response;
  },
  error => {
    const url = error.config.url;
    const params = error.config.data;
    console.warn('API error url -->', url);
    console.warn('API error params --> ', params);
    console.warn('API error data -->', error);

    return Promise.reject(error);
  },
);
