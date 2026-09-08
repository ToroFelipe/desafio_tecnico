export class AppError extends Error {
    constructor(
      public readonly statusCode: number,
      public readonly code: string,
      message: string,
    ) {
      super(message);
      this.name = 'AppError';
    }
  
    static unauthorized(code: string, message: string): AppError {
      return new AppError(401, code, message);
    }
  
    static forbidden(code: string, message: string): AppError {
      return new AppError(403, code, message);
    }
  
    static badRequest(code: string, message: string): AppError {
      return new AppError(400, code, message);
    }
  
    static notFound(code: string, message: string): AppError {
      return new AppError(404, code, message);
    }
  }