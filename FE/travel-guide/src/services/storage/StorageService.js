export const StorageService = {
  getToken: () => localStorage.getItem("access_token"),
  setToken: (token) => localStorage.setItem("access_token", token),
  removeToken: () => localStorage.removeItem("access_token"),

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
  removeUser: () => localStorage.removeItem("user"),

  isExpired: () => {
    const token = StorageService.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch (error) {
      return true;
    }
  },

  signout: () => {
    StorageService.removeToken();
    StorageService.removeUser();
  },
};
