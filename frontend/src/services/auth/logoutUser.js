import api from "../../utils/axiosUtility/api";
import { getErrorMessage } from "../../utils/axiosUtility/getErrorMessage";

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    });
  }
};