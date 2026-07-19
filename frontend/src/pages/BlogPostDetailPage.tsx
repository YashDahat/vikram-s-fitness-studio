import { useParams } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogPostById } = useBlog();
  const { data: blogPost, isLoading, error } = getBlogPostById(id || '');

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="p-8 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="p-8 text-center text-red-500">
              Error loading blog post: {error.message}
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  if (!blogPost) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="p-8 text-center text-gray-600">
              Blog post not found.
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              {blogPost.title}
            </h1>
            <p className="text-gray-600 text-sm mb-2">
              By <span className="font-semibold">{blogPost.author ?? 'Unknown Author'}</span> on{' '}
              {blogPost.publicationDate ? new Date(blogPost.publicationDate).toLocaleDateString() : 'N/A'}
            </p>
            <div className="prose prose-lg max-w-none text-[#333333] leading-relaxed mt-8">
              <p>{blogPost.content}</p>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostDetailPage;