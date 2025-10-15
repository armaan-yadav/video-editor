// Shared render jobs store
// This is a singleton that persists across module reloads in development

export interface RenderJob {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  outputPath?: string;
  error?: string;
}

// Use a global variable to persist the Map across hot reloads in development
const globalForRenderJobs = globalThis as unknown as {
  renderJobs: Map<string, RenderJob> | undefined;
};

export const renderJobs =
  globalForRenderJobs.renderJobs ?? new Map<string, RenderJob>();

if (process.env.NODE_ENV !== "production") {
  globalForRenderJobs.renderJobs = renderJobs;
}

export function getRenderJobs() {
  return renderJobs;
}

export function createRenderJob(id: string): RenderJob {
  const job: RenderJob = {
    id,
    status: "PENDING",
    progress: 0,
  };
  renderJobs.set(id, job);
  console.log(`[Render Jobs] Created job ${id}. Total jobs: ${renderJobs.size}`);
  return job;
}

export function updateRenderJob(id: string, updates: Partial<RenderJob>): void {
  const job = renderJobs.get(id);
  if (job) {
    Object.assign(job, updates);
    console.log(`[Render Jobs] Updated job ${id}:`, updates);
  }
}

export function getRenderJob(id: string): RenderJob | undefined {
  const job = renderJobs.get(id);
  console.log(`[Render Jobs] Getting job ${id}. Found: ${!!job}. Total jobs: ${renderJobs.size}`);
  if (!job) {
    console.log(`[Render Jobs] Available jobs:`, Array.from(renderJobs.keys()));
  }
  return job;
}
