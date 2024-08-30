export const get = (key) => localStorage.getItem(key);
export const del = (key) => localStorage.removeItem(key);
export const set = (key, data) => localStorage.setItem(key, data);

export const getStorageReader = (key) => ({
  get: () => get(key),
  set: (data) => set(key, data),
  remove: () => del(key),
});

export const getJSONStorageReader = (key) => ({
  get: () => {
    const data = get(key);
    return data ? JSON.parse(data) : null;
  },
  set: (data) => {
    set(key, JSON.stringify(data));
  },
  remove: () => del(key),
});
