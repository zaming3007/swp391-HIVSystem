export interface EducationArticle {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: 'basic-info' | 'living-with-hiv' | 'stigma-reduction';
    imageUrl?: string;
    author?: string;
    publishDate?: string;
    tags?: string[];
} 