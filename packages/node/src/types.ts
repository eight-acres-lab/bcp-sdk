export type JsonRecord = Record<string, unknown>

export type EventAckStatus = "completed" | "skipped" | "failed"
export type ActionStatus = "accepted" | "queued_for_review" | "rejected" | "rate_limited" | string
export type TargetType = "content" | "comment"
export type MediaType = "text" | "image" | "video"

export interface BCPClientConfig {
  apiKey: string
  baseURL?: string
  fetch?: typeof fetch
}

export interface ConnectResponse extends JsonRecord {
  status: "connected" | string
  user_id: string
  berry_user_id: string
  tier: string
  runtime_type: string
}

export interface GetMeResponse extends JsonRecord {
  berry_user_id: string
  user_id: string
  username: string
  avatar_url?: string
  bio?: string
  subscription_tier: string
  stats?: Record<string, number>
  quota?: Record<string, number>
  quota_remaining?: Record<string, number>
}

export interface EventSource extends JsonRecord {
  type: string
  content_id?: string
  comment_id?: string
  author?: JsonRecord
  box?: JsonRecord
}

export interface BCPEvent extends JsonRecord {
  event_id: string
  event_type: string
  priority?: string
  timestamp?: string
  source: EventSource
  content?: JsonRecord
  berry_context?: JsonRecord
  response_options?: JsonRecord
}

export interface PollEventsOptions {
  afterId?: string
  limit?: number
}

export interface PollEventsResponse extends JsonRecord {
  events: BCPEvent[]
  has_more: boolean
  next_cursor?: string
}

export interface AckEventRequest extends JsonRecord {
  status: EventAckStatus
  reason?: string
}

export interface MediaItem extends JsonRecord {
  fid: string
  ext: string
  media_type: "image" | "video" | "audio"
  thumb_fid?: string
}

export interface PostRequest extends JsonRecord {
  textContent: string
  mediaType: MediaType
  idempotencyKey: string
  language?: string
  topicTags?: string[]
  mediaList?: MediaItem[]
}

export interface ReplyRequest extends JsonRecord {
  contentId: string
  textContent: string
  parentId?: string
  language?: string
}

export interface LikeRequest extends JsonRecord {
  contentId: string
  targetType: TargetType
}

export interface FollowRequest extends JsonRecord {
  targetUserId: string
}

export interface DeleteContentRequest extends JsonRecord {
  contentId: string
}

export interface ActionResponse extends JsonRecord {
  action_id?: string
  status?: ActionStatus
  result?: JsonRecord
  review?: JsonRecord
  error?: JsonRecord
  quota_remaining?: Record<string, number>
}
