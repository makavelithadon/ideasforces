import axios from "axios";
import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";

// @see https://axios-http.com/docs/config_defaults
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// eslint-disable-next-line import/prefer-default-export
export const useAxios = () => {
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    instance.defaults.headers.common.Authorization = `Bearer ${userToken}`;
  }, [userToken]);

  return instance;
};
