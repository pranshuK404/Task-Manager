import api from "../../utils/axiosUtility/api.js";
import { getErrorMessage } from "../../utils/axiosUtility/getErrorMessage";

export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    });
  }
};
