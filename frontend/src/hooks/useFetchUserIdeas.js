import { useCallback } from "react";
import { useAxios } from "./useAxios";

// eslint-disable-next-line import/prefer-default-export
export const useFetchUserIdeas = () => {
  const axiosClient = useAxios();

  const fetchUserIdeas = useCallback(
    ({ companyId, userId, onSuccess, onError }) => {
      return axiosClient
        .get(`/companies/${companyId}/users/${userId}/ideas`)
        .then(onSuccess)
        .catch(onError);
    },
    []
  );

  return { fetchUserIdeas };
};
