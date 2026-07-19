import { Link } from 'react-router-dom';
import { BlogPostDto } from '@/types/blog';
import { ROUTES } from '@/routes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogCardProps {
  post: BlogPostDto;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const truncatedContent = post.content ? `${post.content.substring(0, 150)}...` : '';
  const imageUrl = `https://source.unsplash.com/random/400x250?fitness,health,${post.id}`;

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <img src={imageUrl} alt={post.title ?? 'Blog Post Image'} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{truncatedContent}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>By {post.author ?? 'Unknown'}</span>
          <span>{post.publicationDate ? new Date(post.publicationDate).toLocaleDateString() : 'N/A'}</span>
        </div>
        <Link to={ROUTES.BLOG_POST_DETAIL.replace(':id', post.id ?? '')} className="mt-auto">
          <Button className="w-full bg-[#F26419] hover:bg-[#E05A17] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
            Read More
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default BlogCard;