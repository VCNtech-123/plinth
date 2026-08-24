import mongoose from 'mongoose';
import redis from './redis';

export const invalidateDashboardCache = async (workspaceId: mongoose.Types.ObjectId): Promise<void> => {
  const cacheKey = `dashboard:${workspaceId.toString()}`;
  try {
    await redis.del(cacheKey);
    console.log(`Cache invalidated for workspace: ${workspaceId.toString()}`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

export const invalidateProjectCache = async (workspaceId: mongoose.Types.ObjectId): Promise<void> => {
  await invalidateDashboardCache(workspaceId);
};

export const invalidateTaskCache = async (workspaceId: mongoose.Types.ObjectId): Promise<void> => {
  await invalidateDashboardCache(workspaceId);
};

export const invalidateClientCache = async (workspaceId: mongoose.Types.ObjectId): Promise<void> => {
  await invalidateDashboardCache(workspaceId);
};