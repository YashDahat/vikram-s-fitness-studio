import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as blogService from '@/services/blogService';
import type { BlogPostDto } from '@/types/blog';
import { toast } from 'sonner';

interface BlogPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  blogPost?: BlogPostDto;
}

const blogPostSchema = z.object({
  id: z.string().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  publicationDate: z.string().min(1, 'Publication date is required'),
  lastModifiedDate: z.string().optional().nullable(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const BlogPostForm = ({ isOpen, onClose, blogPost }: BlogPostFormProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      id: blogPost?.id ?? undefined,
      title: blogPost?.title ?? '',
      content: blogPost?.content ?? '',
      author: blogPost?.author ?? '',
      publicationDate: blogPost?.publicationDate ?? new Date().toISOString().split('T')[0],
      lastModifiedDate: blogPost?.lastModifiedDate ?? undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: blogService.createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Blog post created successfully.');
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create blog post: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostDto }) => blogService.updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', blogPost?.id] });
      toast.success('Blog post updated successfully.');
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to update blog post: ${error.message}`);
    },
  });

  const onSubmit = (data: BlogPostFormValues) => {
    const blogPostDto: BlogPostDto = {
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.author,
      publicationDate: data.publicationDate,
      lastModifiedDate: data.lastModifiedDate,
    };

    if (blogPostDto.id) {
      updateMutation.mutate({ id: blogPostDto.id, data: blogPostDto });
    } else {
      createMutation.mutate(blogPostDto);
    }
  };

  // Reset form when dialog opens or blogPost prop changes
  // useEffect(() => {
  //   reset({
  //     id: blogPost?.id ?? undefined,
  //     title: blogPost?.title ?? '',
  //     content: blogPost?.content ?? '',
  //     author: blogPost?.author ?? '',
  //     publicationDate: blogPost?.publicationDate ?? new Date().toISOString().split('T')[0],
  //     lastModifiedDate: blogPost?.lastModifiedDate ?? undefined,
  //   });
  // }, [blogPost, reset, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        reset();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{blogPost ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
          <DialogDescription>
            {blogPost ? 'Edit the details of the blog post.' : 'Fill in the details for a new blog post.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" {...register('title')} className="col-span-3" />
            {errors.title && <p className="col-span-4 text-right text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea id="content" {...register('content')} className="col-span-3" />
            {errors.content && <p className="col-span-4 text-right text-red-500 text-sm">{errors.content.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input id="author" {...register('author')} className="col-span-3" />
            {errors.author && <p className="col-span-4 text-right text-red-500 text-sm">{errors.author.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="publicationDate" className="text-right">
              Publication Date
            </Label>
            <Input id="publicationDate" type="date" {...register('publicationDate')} className="col-span-3" />
            {errors.publicationDate && <p className="col-span-4 text-right text-red-500 text-sm">{errors.publicationDate.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#1B998B] hover:bg-[#1B998B] text-white font-semibold transition-all duration-200"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {blogPost ? 'Save Changes' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};