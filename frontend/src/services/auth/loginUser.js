import api from "../../utils/axiosUtility/api";
import { getErrorMessage } from "../../utils/axiosUtility/getErrorMessage";

export const loginUser = async ({email, password}) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    });
  }
};
