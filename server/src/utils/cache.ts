import redis from './redis';

export const invalidateDashboardCache = async (workspaceId: string): Promise<void> => {
  const cacheKey = `dashboard:${workspaceId}`;
  try {
    await redis.del(cacheKey);
    console.log(`Cache invalidated for dashboard: ${workspaceId}`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

export const invalidateProjectCache = async (workspaceId: string): Promise<void> => {
  await invalidateDashboardCache(workspaceId);
};

export const invalidateTaskCache = async (workspaceId: string): Promise<void> => {
  await invalidateDashboardCache(workspaceId);
};