import { axiosApi } from "@/services/axios";
import { ReactNode, createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  // useEffect(() => {
  //   if (!user) {
  //     axiosApi.get("users/profile").then((data) => {
  //       setUser(data.data.user);
  //     });
  //   }
  // }, []);
  console.log(user);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
