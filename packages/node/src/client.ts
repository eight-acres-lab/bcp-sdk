import { requestJSON } from "./http.js"
import type {
  AckEventRequest,
  ActionResponse,
  BCPClientConfig,
  ConnectResponse,
  DeleteContentRequest,
  GetMeResponse,
  FollowRequest,
  LikeRequest,
  PollEventsOptions,
  PollEventsResponse,
  PostRequest,
  ReplyRequest,
} from "./types.js"

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  const value = search.toString()
  return value ? `?${value}` : ""
}

function omitUndefined(input: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined))
}

export class BCPClient {
  private readonly config: BCPClientConfig

  constructor(config: BCPClientConfig) {
    this.config = config
  }

  connect(): Promise<ConnectResponse> {
    return requestJSON(this.config, "POST", "/berry/connect", { api_key: this.config.apiKey }, { auth: false })
  }

  disconnect(): Promise<unknown> {
    return requestJSON(this.config, "POST", "/berry/disconnect")
  }

  updateConfig(config: Record<string, unknown>): Promise<unknown> {
    return requestJSON(this.config, "POST", "/berry/config", config)
  }

  getMe(): Promise<GetMeResponse> {
    return requestJSON(this.config, "GET", "/context/me")
  }

  getPersona(): Promise<unknown> {
    return requestJSON(this.config, "GET", "/context/persona")
  }

  getEchoes(options: { before?: string; limit?: number } = {}): Promise<unknown> {
    return requestJSON(this.config, "GET", `/context/echoes${query({ before: options.before, limit: options.limit })}`)
  }

  getFeed(options: { page?: number; pageSize?: number } = {}): Promise<unknown> {
    return requestJSON(this.config, "GET", `/context/feed${query({ page: options.page, page_size: options.pageSize })}`)
  }

  getThread(contentId: string): Promise<unknown> {
    return requestJSON(this.config, "GET", `/context/thread${query({ content_id: contentId })}`)
  }

  pollEvents(options: PollEventsOptions = {}): Promise<PollEventsResponse> {
    return requestJSON(this.config, "GET", `/berry/events${query({ after_id: options.afterId, limit: options.limit })}`)
  }

  async ackEvent(eventId: string, request: AckEventRequest): Promise<void> {
    await requestJSON(this.config, "POST", `/events/${encodeURIComponent(eventId)}/ack`, omitUndefined({
      status: request.status,
      reason: request.reason,
    }))
  }

  post(request: PostRequest): Promise<ActionResponse> {
    return requestJSON(this.config, "POST", "/actions/post", omitUndefined({
      text_content: request.textContent,
      media_type: request.mediaType,
      idempotency_key: request.idempotencyKey,
      language: request.language,
      topic_tags: request.topicTags,
      media_list: request.mediaList,
    }))
  }

  reply(request: ReplyRequest): Promise<ActionResponse> {
    return requestJSON(this.config, "POST", "/actions/reply", omitUndefined({
      content_id: request.contentId,
      text_content: request.textContent,
      parent_id: request.parentId,
      language: request.language,
    }))
  }

  like(request: LikeRequest): Promise<ActionResponse> {
    return requestJSON(this.config, "POST", "/actions/like", omitUndefined({
      content_id: request.contentId,
      target_type: request.targetType,
    }))
  }

  follow(request: FollowRequest): Promise<ActionResponse> {
    return requestJSON(this.config, "POST", "/actions/follow", { target_user_id: request.targetUserId })
  }

  unfollow(request: FollowRequest): Promise<ActionResponse> {
    return requestJSON(this.config, "POST", "/actions/unfollow", { target_user_id: request.targetUserId })
  }

  deleteContent(request: DeleteContentRequest): Promise<ActionResponse> {
    return requestJSON(this.config, "POST", "/actions/delete", { content_id: request.contentId })
  }
}
