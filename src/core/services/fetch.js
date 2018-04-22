import axios from 'axios';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const requests = axios.create({
  baseURL: `http://localhost:4567/`,
  timeout: 10000,
  headers: {
    // Authorization: `Token ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// export default requests;

const get = async (url, timeout = 10000) => {
  console.log('get', url);
  const res = await requests.get(url, { timeout });
  try {
    if (res.status === 200) {
      return res.data;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

const post = async (url, reqParams, timeout = 10000) => {
  console.log('post', url, reqParams);
  const res = await requests.post(url, reqParams);
  try {
    if (res.status === 200) {
      return res.data;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

const Delete = async (url, reqParams, timeout = 10000) => {
  console.log('delete', url, reqParams);
  const res = await requests.delete(url);
  try {
    if (res.status === 200) {
      return res.data;
    }
    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default { post, get, Delete };
