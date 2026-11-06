export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(status: number, path: string) {
    super(`Football API request failed with status ${status}: ${path}`);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(404, path);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends ApiError {
  readonly retryAfterSeconds: number | null;

  constructor(path: string, retryAfterSeconds: number | null) {
    super(429, path);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
