export class CodeError {
  static OK = 1;
  static BAD_REQUEST = 2;
  static UNAUTHORIZED = 3;
  static NOT_FOUND = 4;
  static UNSUPPORTED = 5;
  static INTERNAL_ERROR = 6;
  static UNEXPECTED = 7;
}

export class AppError {
  public readonly message: string;
  public readonly code: CodeError;
  public readonly module?:
    | "controller"
    | "view"
    | "model"
    | "repository"
    | "database";
  public readonly line?: number;

  constructor(
    message: string,
    code: CodeError = CodeError.UNEXPECTED,
    module?: "controller" | "view" | "model" | "repository" | "database",
    line?: number
  ) {
    this.message = message;
    this.code = code;
    this.module = module;
    this.line = line;
  }
}
