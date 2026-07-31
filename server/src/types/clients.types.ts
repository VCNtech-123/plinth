
import mongoose from 'mongoose';

export interface GetClientsQuery {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "inactive";
}

export interface GetClientsFilter {
  owner: mongoose.Types.ObjectId;
  isDeleted: boolean;
  name?: {
    $regex: string;
    $options: string;
  };
  status?: "active" | "inactive";
}
