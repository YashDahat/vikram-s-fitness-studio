package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.dto.BlogPostDto;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.model.BlogPost;
import com.vikramsfitnessstudio.repository.BlogPostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    public BlogPostService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public List<BlogPostDto> getAllBlogPosts() {
        return blogPostRepository.findAllByOrderByPublicationDateDesc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public BlogPostDto getBlogPostById(UUID id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        return convertToDto(blogPost);
    }

    public BlogPostDto createBlogPost(BlogPostDto blogPostDto) {
        if (blogPostDto.getTitle() == null || blogPostDto.getTitle().isBlank() ||
            blogPostDto.getContent() == null || blogPostDto.getContent().isBlank()) {
            throw new IllegalArgumentException("Title and content cannot be empty.");
        }

        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(blogPostDto.getTitle());
        blogPost.setContent(blogPostDto.getContent());
        blogPost.setAuthor(blogPostDto.getAuthor() != null ? blogPostDto.getAuthor() : "Anonymous");
        blogPost.setPublicationDate(LocalDate.now());
        blogPost.setLastModifiedDate(LocalDateTime.now());
        BlogPost savedBlogPost = blogPostRepository.save(blogPost);
        return convertToDto(savedBlogPost);
    }

    public BlogPostDto updateBlogPost(UUID id, BlogPostDto blogPostDto) {
        BlogPost existingBlogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));

        if (blogPostDto.getTitle() == null || blogPostDto.getTitle().isBlank() ||
            blogPostDto.getContent() == null || blogPostDto.getContent().isBlank()) {
            throw new IllegalArgumentException("Title and content cannot be empty.");
        }

        existingBlogPost.setTitle(blogPostDto.getTitle());
        existingBlogPost.setContent(blogPostDto.getContent());
        existingBlogPost.setAuthor(blogPostDto.getAuthor() != null ? blogPostDto.getAuthor() : existingBlogPost.getAuthor());
        existingBlogPost.setLastModifiedDate(LocalDateTime.now());
        BlogPost updatedBlogPost = blogPostRepository.save(existingBlogPost);
        return convertToDto(updatedBlogPost);
    }

    public void deleteBlogPost(UUID id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        blogPostRepository.delete(blogPost);
    }

    private BlogPostDto convertToDto(BlogPost blogPost) {
        return BlogPostDto.builder()
                .id(blogPost.getId())
                .title(blogPost.getTitle())
                .content(blogPost.getContent())
                .author(blogPost.getAuthor())
                .publicationDate(blogPost.getPublicationDate())
                .lastModifiedDate(blogPost.getLastModifiedDate())
                .build();
    }
}