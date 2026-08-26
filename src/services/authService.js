// src/services/authService.js
import { loginApi, registerApi, profileApi , logoutApi} from "../api/authApi";

export const loginUser = async (data) => {
  const response = await loginApi(data);
  return response.data;
};

export const logoutUser = async() => {
  const response = await logoutApi();
  return response
}
export const registerUser = async (data) => {
  const response = await registerApi(data);
  return response.data;
};

export const getProfile = async () => {
    const response = await profileApi();
    return response.data;
};