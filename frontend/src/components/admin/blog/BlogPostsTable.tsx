import { useState } from 'react';
import { BlogPostDto } from '@/types/blog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { BlogPostForm } from './BlogPostForm';
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog';

interface BlogPostsTableProps {
  posts: BlogPostDto[];
  onEdit: (post: BlogPostDto) => void;
  onDelete: (id: string) => void;
}

export function BlogPostsTable({ posts, onEdit, onDelete }: BlogPostsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPostDto | null>(null);

  const handleEditClick = (post: BlogPostDto) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (post: BlogPostDto) => {
    setSelectedPost(post);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPost?.id) {
      onDelete(selectedPost.id);
      setIsDeleteDialogOpen(false);
      setSelectedPost(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Publication Date</TableHead>
            <TableHead>Last Modified Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No blog posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.publicationDate}</TableCell>
                <TableCell>{post.lastModifiedDate}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(post)}
                    className="mr-2 transition-all duration-200 hover:bg-gray-100"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(post)}
                    className="transition-all duration-200 hover:opacity-90"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <BlogPostForm
          post={selectedPost}
          onClose={handleFormClose}
          onSave={() => {
            onEdit(selectedPost!); // The onEdit function will handle the actual update
            handleFormClose();
          }}
        />
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        resourceName="blog post"
      />
    </div>
  );
}