import React from 'react';
import { useBlog } from '@/hooks/useBlog';
import BlogCard from '@/components/blog/BlogCard';
import Layout from '@/components/Layout';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPage: React.FC = () => {
  const { getAllBlogPosts } = useBlog();
  const { data: blogPosts, isLoading, isError } = getAllBlogPosts();

  if (isError) {
    return (
      <Layout>
        <section className="py-16 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-[#333333] mb-4">Our Latest Insights</h1>
            <p className="text-lg text-red-500">Failed to load blog posts. Please try again later.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/images/blog-hero.webp)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Latest Insights</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Stay informed and inspired with our articles on fitness, health, and wellness.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-[450px] w-full rounded-xl" />
              ))}
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">No blog posts found.</h2>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;