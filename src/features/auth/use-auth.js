import React, {useState, useContext, createContext} from "react";
import {client} from '../../api/client'

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [role,setRole] = useState(0)
  // Wrap any rest methods we want to use making sure ...
  // ... to save the user to state.
  const signin = async (userName, password) => {
    try {
      let url = '/api/login';
      const response = await client.post("https://softforceapps.com:3000/api/login", {
        username: userName,
        password: password
      })
      setUser(response.user_id);
      setRole(response.role_id)
    } catch (error) {
      console.log(error);
    }
  };
 
  const signout = () => {
    setRole(0)
    setUser(null)
  };
  return {user, role, signin, signout};
}
const AuthContext = createContext();
export function ProvideAuth({children}) {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      {children} </AuthContext.Provider>
  );
}
export const useAuth = () => {
  return useContext(AuthContext);
};
