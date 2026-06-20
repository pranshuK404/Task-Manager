export const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || "Server Error";
  }

  if (error.request) {
    return "Network Error";
  }

  return error.message;
};
