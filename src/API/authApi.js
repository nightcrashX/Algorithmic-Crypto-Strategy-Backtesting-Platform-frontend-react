import api from "./client";

export const loginApi = (data) => {
  return api.post("/user/login", data);
};

export const registerApi = (data) => {
  return api.post("/user/register", data);
};

export const profileApi = () => {
  return api.get("/user/profile");
};

export const logoutApi = () => {
  return api.delete("/user/logout",{withCredentials:true,});
};