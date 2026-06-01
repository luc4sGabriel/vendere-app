import { AppError } from "./app-error";
import { HttpStatus } from "./http-status.enum";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}