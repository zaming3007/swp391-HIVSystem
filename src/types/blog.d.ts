export interface BlogPost {
    id: string;
    title: string;
    content: string;
    publishedDate: string;
    status: 'published' | 'draft';
    viewCount: number;
    commentCount: number;
}

export interface BlogComment {
    id: string;
    postId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export interface BlogPostFilters {
    query?: string;
    sortBy?: 'newest' | 'oldest';
    status?: 'published' | 'draft';
} 