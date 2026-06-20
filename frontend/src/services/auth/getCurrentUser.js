import api from "../../utils/axiosUtility/api";
import { getErrorMessage } from "../../utils/axiosUtility/getErrorMessage";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    });
  }
};
