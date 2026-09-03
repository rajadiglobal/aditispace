/**
 * Worker service — API calls for the Worker resource.
 */

import { api } from "@/lib/api"
import type {
  PaginatedWorkerResponse,
  Worker,
  WorkerCreatePayload,
} from "@/types/crm"

export const workerService = {
  /**
   * Self-registration for contractors / tradespeople.
   * Public endpoint — no auth token required.
   */
  async registerWorker(
    payload: WorkerCreatePayload
  ): Promise<{ id: string; message: string }> {
    const { data } = await api.post<{ id: string; message: string }>(
      "/api/v1/workers/",
      payload
    )
    return data
  },

  /**
   * Admin: List workers with optional filters.
   */
  async getWorkers(params?: {
    is_available?: boolean
    worker_type?: string
    city?: string
    limit?: number
    offset?: number
  }): Promise<PaginatedWorkerResponse> {
    const { data } = await api.get<PaginatedWorkerResponse>("/api/v1/workers/", {
      params,
    })
    return data
  },
}
