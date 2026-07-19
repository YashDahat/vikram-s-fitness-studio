import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { BlogPostsTable } from '@/components/admin/blog/BlogPostsTable';
import { BlogPostForm } from '@/components/admin/blog/BlogPostForm';
import { useBlog } from '@/hooks/useBlog';
import * as blogService from '@/services/blogService';
import type { BlogPostDto } from '@/types/blog';
import { Dialog } from '@radix-ui/react-dialog';

export const AdminBlogPage = () => {
  const queryClient = useQueryClient();
  const { getAllBlogPosts } = useBlog();
  const { data: blogPosts, isLoading, error } = getAllBlogPosts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPostDto | null>(null);

  const createBlogPostMutation = useMutation({
    mutationFn: blogService.createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post created successfully.');
      setIsFormOpen(false);
      setSelectedPost(null);
    },
    onError: (err) => {
      toast.error(`Failed to create blog post: ${err.message}`);
    },
  });

  const updateBlogPostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostDto }) => blogService.updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post updated successfully.');
      setIsFormOpen(false);
      setSelectedPost(null);
    },
    onError: (err) => {
      toast.error(`Failed to update blog post: ${err.message}`);
    },
  });

  const deleteBlogPostMutation = useMutation({
    mutationFn: blogService.deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post deleted successfully.');
    },
    onError: (err) => {
      toast.error(`Failed to delete blog post: ${err.message}`);
    },
  });

  const handleCreateClick = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleEditPost = (post: BlogPostDto) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleDeletePost = (id: string) => {
    deleteBlogPostMutation.mutate(id);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPost(null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading blog posts...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen text-red-500">
          <p>Error loading blog posts: {error.message}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <section className="py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Manage Blog Posts</h1>
            <Button
              onClick={handleCreateClick}
              className="bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold transition-all duration-200"
            >
              Create New Post
            </Button>
          </div>

          {blogPosts && (
            <BlogPostsTable
              posts={blogPosts}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          )}

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <BlogPostForm
              isOpen={isFormOpen}
              onClose={handleFormClose}
              blogPost={selectedPost ?? undefined}
            />
          </Dialog>
        </div>
      </section>
    </AdminLayout>
  );
};