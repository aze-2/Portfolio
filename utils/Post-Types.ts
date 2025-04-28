export type PostType = {
    id: string;
    created_at: string;
    title: string;
    address: string;
    content: string;
    user_id: string;
    image_url: string;
    lat?: number;
    lng?: number;
    profiles?: {
      name?: string;
      avatar_url?: string;
    }
  }

  export type PostQueryType = {
    id: string;
    created_at: string;
    title: string;
    address: string;
    lat?: number;
    lng?: number;
    user_id: string;
    profiles?: {
      name?: string;
      avatar_url?: string;
    }[];
  }