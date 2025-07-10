import api from './api';

export interface BlogPost {
    id?: string;
    title: string;
    summary?: string;
    content: string;
    coverImage?: string;
    publishedDate?: string;
    status: 'draft' | 'published';
    viewCount?: number;
    authorId?: string;
    authorName?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface BlogFilter {
    status?: string;
    search?: string;
}

const blogService = {
    // Lấy danh sách bài viết
    async getBlogPosts(filters?: BlogFilter): Promise<BlogPost[]> {
        try {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.search) params.append('term', filters.search);

            const response = await api.get(`/blog${filters?.search ? '/search' : ''}?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            // Fallback to test endpoint if real API fails
            try {
                const fallbackResponse = await api.get('/blog/test');
                return fallbackResponse.data;
            } catch (fallbackError) {
                return [];
            }
        }
    },

    // Lấy chi tiết bài viết
    async getBlogPostById(id: string): Promise<BlogPost> {
        try {
            const response = await api.get(`/blog/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blog post with id ${id}:`, error);
            // Fallback to finding in test data if real API fails
            try {
                const allPosts = await api.get('/blog/test');
                const post = allPosts.data.find((p: BlogPost) => p.id === id);

                if (!post) {
                    throw new Error('Post not found');
                }

                return post;
            } catch (fallbackError) {
                throw error;
            }
        }
    },

    // Tạo bài viết mới
    async createBlogPost(post: BlogPost): Promise<BlogPost> {
        const response = await api.post('/blog', post);
        return response.data;
    },

    // Cập nhật bài viết
    async updateBlogPost(id: string, post: BlogPost): Promise<BlogPost> {
        const response = await api.put(`/blog/${id}`, { ...post, id });
        return response.data;
    },

    // Xóa bài viết
    async deleteBlogPost(id: string): Promise<void> {
        await api.delete(`/blog/${id}`);
    },

    // Upload ảnh bìa
    async uploadCoverImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/fileupload/upload/blog-cover', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.url;
    }
};

export default blogService; 