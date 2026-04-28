export class BCPError extends Error {
  readonly status?: number
  readonly code?: string
  readonly response?: unknown

  constructor(message: string, status?: number, code?: string, response?: unknown) {
    super(message)
    this.name = "BCPError"
    this.status = status
    this.code = code
    this.response = response
  }
}

export class BCPAuthError extends BCPError {
  constructor(message: string, status?: number, code = "auth_error", response?: unknown) {
    super(message, status, code, response)
    this.name = "BCPAuthError"
  }
}

export class BCPRateLimitError extends BCPError {
  readonly retryAfter?: Date

  constructor(message: string, status?: number, code = "rate_limited", response?: unknown, retryAfter?: Date) {
    super(message, status, code, response)
    this.name = "BCPRateLimitError"
    this.retryAfter = retryAfter
  }
}

export class BCPRequestError extends BCPError {
  constructor(message: string, status?: number, code?: string, response?: unknown) {
    super(message, status, code, response)
    this.name = "BCPRequestError"
  }
}

export class BCPServerError extends BCPError {
  constructor(message: string, status?: number, code?: string, response?: unknown) {
    super(message, status, code, response)
    this.name = "BCPServerError"
  }
}

type ErrorEnvelope = {
  error?: string | {
    code?: string
    message?: string
    retry_after?: string
  }
  message?: string
}

export function localAuthError(message: string): BCPAuthError {
  return new BCPAuthError(message)
}

function readCode(response: ErrorEnvelope): string | undefined {
  return typeof response.error === "object" ? response.error.code : undefined
}

function readMessage(response: ErrorEnvelope): string {
  if (typeof response.error === "string") return response.error
  if (typeof response.error?.message === "string") return response.error.message
  if (typeof response.message === "string") return response.message
  return "BCP request failed"
}

function readRetryAfter(response: ErrorEnvelope): Date | undefined {
  if (typeof response.error !== "object" || !response.error.retry_after) return undefined
  const retryAfter = new Date(response.error.retry_after)
  return Number.isNaN(retryAfter.valueOf()) ? undefined : retryAfter
}

export function mapBCPError(status: number, response: unknown): BCPError {
  const envelope = response && typeof response === "object" ? response as ErrorEnvelope : {}
  const code = readCode(envelope)
  const message = readMessage(envelope)

  if (status === 429 || code === "rate_limited") {
    return new BCPRateLimitError(message, status, code ?? "rate_limited", response, readRetryAfter(envelope))
  }
  if (status === 401 || status === 403) return new BCPAuthError(message, status, code ?? "auth_error", response)
  if (status >= 400 && status < 500) return new BCPRequestError(message, status, code, response)
  return new BCPServerError(message, status, code, response)
}
