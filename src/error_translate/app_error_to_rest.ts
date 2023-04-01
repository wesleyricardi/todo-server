import { AppError, CodeError } from "../error/error";

export default function translate_app_error_to_rest(appError: AppError): {
  status: number;
  message: string;
} {
  let status = 200;
  let message = "";

  switch (appError.code) {
    case CodeError.BAD_REQUEST:
      status = 400;
      message = appError.message;
      break;
    case CodeError.NOT_FOUND:
      status = 204;
      message = appError.message;
      break;
    case CodeError.UNAUTHORIZED:
      status = 203;
      message = appError.message;
      break;
    default:
      status = 500;
      message = "Internal Server Error";
      break;
  }

  return {
    status,
    message,
  };
}
