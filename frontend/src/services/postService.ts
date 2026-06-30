import { api } from './api';
import type { WrappedResponse } from './courseService';

export interface ApiPost {
  id: number;
  title: string;
  is_private: boolean;
  user_id: number;
  views: number;
  created_at: string;
  updated_at: string;
  author_name?: string | null;
}

export interface ApiComment {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCommentTree extends ApiComment {
  replies: ApiCommentTree[];
}

export interface ApiPostDetail extends ApiPost {
  content: string;
  comments: ApiCommentTree[];
}

export const postService = {
  getPosts: async (search?: string, skip: number = 0, limit: number = 100): Promise<ApiPost[]> => {
    const params = new URLSearchParams();
    if (search) {
      // Use URL encoding (percent encoding) for search query to avoid Uvicorn 400 Bad Request
      params.append('search', search);
    }
    params.append('skip', String(skip));
    params.append('limit', String(limit));
    
    // Note: FastAPI redirects /posts to /posts/ with 307. We include the trailing slash to avoid redirect delay/errors.
    const res = await api.get<WrappedResponse<ApiPost[]>>(`/posts/?${params.toString()}`);
    return res.response || [];
  },

  getPostDetail: async (postId: number, password?: string): Promise<ApiPostDetail> => {
    const params = new URLSearchParams();
    if (password) {
      params.append('password', password);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await api.get<WrappedResponse<ApiPostDetail>>(`/posts/${postId}${queryString}`);
    return res.response;
  },

  createPost: async (postData: { title: string; content: string; is_private: boolean; password?: string; author_name?: string }): Promise<ApiPost> => {
    const res = await api.post<WrappedResponse<ApiPost>>('/posts/', postData);
    return res.response;
  },

  updatePost: async (postId: number, postData: { title?: string; content?: string; is_private?: boolean; password?: string; author_name?: string }): Promise<ApiPost> => {
    const res = await api.put<WrappedResponse<ApiPost>>(`/posts/${postId}`, postData);
    return res.response;
  },

  deletePost: async (postId: number): Promise<void> => {
    await api.delete<void>(`/posts/${postId}`);
  },

  createComment: async (postId: number, content: string, parentId?: number): Promise<ApiComment> => {
    const res = await api.post<WrappedResponse<ApiComment>>(`/posts/${postId}/comments`, {
      content,
      parent_id: parentId || null
    });
    return res.response;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete<void>(`/comments/${commentId}`);
  }
};
