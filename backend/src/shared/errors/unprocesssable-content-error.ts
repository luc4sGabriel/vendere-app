import { AppError } from "./app-error";
import { HttpStatus } from "./http-status.enum";

export class UnprocesssableContentError extends AppError {
  constructor(message = "Unprocessable Content") {
    super(message, HttpStatus.UNPROCESSABLE_CONTENT);
  }
}
