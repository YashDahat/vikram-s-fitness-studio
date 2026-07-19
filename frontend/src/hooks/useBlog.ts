import { useQuery } from '@tanstack/react-query';
import * as blogService from '@/services/blogService';
import type { BlogPostDto } from '@/types/blog';

export const useBlog = () => {
  const getAllBlogPosts = () => {
    return useQuery<BlogPostDto[], Error>({
      queryKey: ['blogPosts'],
      queryFn: blogService.getAllBlogPosts,
    });
  };

  const getBlogPostById = (id: string) => {
    return useQuery<BlogPostDto, Error>({
      queryKey: ['blogPost', id],
      queryFn: () => blogService.getBlogPostById(id),
      enabled: !!id,
    });
  };

  return {
    getAllBlogPosts,
    getBlogPostById,
  };
};