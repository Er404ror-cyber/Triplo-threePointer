import type { Post } from '../types/database';

export interface PostWithRelations extends Post {
  comments: any[];
  likes: { device_id: string }[];
}