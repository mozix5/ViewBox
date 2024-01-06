import { createContext, useContext, useState } from "react";

const UserDataContext = createContext();
export const useUserData = () => {
  return useContext(UserDataContext);
};

export const UserContext = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  const handleUser = (user) => {
    return setUser(user);
  };
  const handleToken = (token) => {
    return setToken(token);
  };
  return (
    <UserDataContext.Provider value={{ handleUser, handleToken, user, token }}>
      {children}
    </UserDataContext.Provider>
  );
};
