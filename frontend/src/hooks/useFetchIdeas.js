import { useCallback } from "react";
import { useAxios } from "./useAxios";

// eslint-disable-next-line import/prefer-default-export
export const useFetchIdeas = () => {
  const axiosClient = useAxios();

  const fetchIdeas = useCallback(
    ({ companyId, userId, onSuccess, onError }) => {
      return axiosClient
        .get(`/companies/${companyId}/ideas/${userId}/`)
        .then(onSuccess)
        .catch(onError);
    },
    []
  );

  return { fetchIdeas };
};
