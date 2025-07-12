import authApi from './authApi';

// Types for blog
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    summary: string;
    authorId: string;
    authorName: string;
    status: 0 | 1; // 0 = Draft, 1 = Published
    viewCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt?: string;
    publishedAt?: string;
}

export interface BlogComment {
    id: string;
    blogPostId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

export interface BlogPostCreateDto {
    title: string;
    content: string;
    summary: string;
    status: 0 | 1; // 0 = Draft, 1 = Published
}

export interface BlogPostUpdateDto {
    title: string;
    content: string;
    summary: string;
    status: 0 | 1; // 0 = Draft, 1 = Published
}

export interface BlogCommentCreateDto {
    content: string;
}

// Blog Post API functions
export const getAllPublishedPosts = async (): Promise<BlogPost[]> => {
    try {
        const response = await authApi.get('/blog/published');
        return response.data;
    } catch (error) {
        console.error('Error fetching published posts:', error);
        return [];
    }
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
    try {
        const response = await authApi.get('/blog/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all posts:', error);
        return [];
    }
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
    try {
        const response = await authApi.get(`/blog/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
};

export const incrementViewCount = async (id: string): Promise<BlogPost | null> => {
    try {
        const response = await authApi.post(`/blog/${id}/view`);
        return response.data;
    } catch (error) {
        console.error('Error incrementing view count:', error);
        return null;
    }
};

export const searchPosts = async (query: string): Promise<BlogPost[]> => {
    try {
        const response = await authApi.get(`/blog/search?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error('Error searching posts:', error);
        return [];
    }
};

export const createPost = async (postData: BlogPostCreateDto): Promise<BlogPost | null> => {
    try {
        const response = await authApi.post('/blog', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
};

export const updatePost = async (id: string, postData: BlogPostUpdateDto): Promise<BlogPost | null> => {
    try {
        const response = await authApi.put(`/blog/${id}`, postData);
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error);
        return null;
    }
};

export const deletePost = async (id: string): Promise<boolean> => {
    try {
        await authApi.delete(`/blog/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting post:', error);
        return false;
    }
};

export const publishPost = async (id: string): Promise<boolean> => {
    try {
        await authApi.post(`/blog/${id}/publish`);
        return true;
    } catch (error) {
        console.error('Error publishing post:', error);
        return false;
    }
};

export const unpublishPost = async (id: string): Promise<boolean> => {
    try {
        await authApi.post(`/blog/${id}/unpublish`);
        return true;
    } catch (error) {
        console.error('Error unpublishing post:', error);
        return false;
    }
};

// Blog Comment API functions
export const getCommentsByPostId = async (postId: string): Promise<BlogComment[]> => {
    try {
        const response = await authApi.get(`/blog/${postId}/comments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

export const createComment = async (postId: string, commentData: BlogCommentCreateDto): Promise<BlogComment | null> => {
    try {
        const response = await authApi.post(`/blog/${postId}/comments`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        return null;
    }
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
    try {
        await authApi.delete(`/blog/comments/${commentId}`);
        return true;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return false;
    }
};

// Legacy functions for backward compatibility (will be removed)
export const addComment = async (postId: string, userName: string, content: string): Promise<BlogComment | null> => {
    return await createComment(postId, { content });
};
