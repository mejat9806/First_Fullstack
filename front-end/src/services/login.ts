import { axiosApi } from "./axios";

export const login = async (email: string, password: string) => {
  const res = await axiosApi.post("users/login", {
    email,
    password,
  });

  return res;
};
