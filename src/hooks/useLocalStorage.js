const useLocalStorage = () => {
  const loginUser = {
    userEmail: "none",
    userAuth: false,
    language: "none",
    languageForLearn: "none",
  };
  const getItem = (item) => {
    const storageItem = JSON.parse(localStorage.getItem(item));
    if (storageItem === null) {
      return loginUser;
    }
    return storageItem;
  };

  const setItem = (item, key) => {
    return localStorage.setItem(key, JSON.stringify(item));
  };
  return { getItem, setItem };
};

export default useLocalStorage;
