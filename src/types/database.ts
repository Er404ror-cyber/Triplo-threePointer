export type PostType = 'post' | 'event' | 'treino' | 'calendar';

export interface Comment {
  id: string;
  post_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  type: PostType;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  event_date?: string;
  treino_difficulty?: 'iniciante' | 'intermediario' | 'avancado';
  calendar_date?: string;
  comments?: Comment[];
}