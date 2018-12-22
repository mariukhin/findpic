import axios from 'axios';

const key = '5bce06a0411b5b82c662168a672cb8f9b7695bb1e3842';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


export const addUrl = item => {
  return axios.post('/urls', item);
};
export const getAllUrls = () => {
  return axios.get('/urls');
};
export const getUrlFromCite = item => {
    return axios.get(`https://api.linkpreview.net?key=${key}&q=${item}`)
    .catch(error =>alert(`Повторите попытку! ${error}`));
};
export const deleteUrl = id => {
  return axios.delete(`/urls/${id}`).then(res => {
    if (res.status === 200) {
      return id;
    }
  });
};