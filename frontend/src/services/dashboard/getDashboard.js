import api from "../../utils/axiosUtility/api";
import { getErrorMessage } from "../../utils/axiosUtility/getErrorMessage";

export const getDashboard = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), {
      cause: error,
    });
  }
};