export const set = value => {
    localStorage.setItem('url', JSON.stringify(value));
};
  
export const get = () => {
    const data = localStorage.getItem('url');
    return data ? JSON.parse(data) : null;
};