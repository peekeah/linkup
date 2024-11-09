import { z } from "zod";

type RequestError = {
  message: string
} | unknown;

const errorHandler = (err: RequestError) => {
  let statusCode: number = 500;
  let errMessage: unknown = "Internal server error";

  if (err instanceof z.ZodError) {
    statusCode = 403;
    errMessage = err.errors
  } else if (err && typeof err === 'object' && 'message' in err) {
    errMessage = err.message
  }

  return { statusCode, errMessage }
}

export default errorHandler
