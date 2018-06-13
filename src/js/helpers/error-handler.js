/**
 * Fetch response Error Handler
 * @version 0.0.1
 */
const handleErrorResponse = (response, message) => {
  const error = new Error(response.statusText);
  error.status = response.status;

  switch (response.status) {
    case 400:
      error.message = "Server: Bad JSON Request";
      break;

    case 401:
      error.message = "Server: Unauthorized";
      break;

    case 403:
      error.message = "Server: Forbidden";
      break;

    case 404:
      error.message = "Server: Not found";
      break;

    case 409:
      error.message = "Server: Already exists";
      break;

    default:
      error.message = "Server: Unknown Server Error";
  }

  return error;
}

export default handleErrorResponse;
