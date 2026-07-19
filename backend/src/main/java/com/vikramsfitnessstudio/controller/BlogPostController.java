package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.BlogPostDto;
import com.vikramsfitnessstudio.service.BlogPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/blog")
public class BlogPostController {

    private final BlogPostService blogPostService;

    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    @GetMapping
    public ResponseEntity<List<BlogPostDto>> getAllBlogPosts() {
        List<BlogPostDto> blogPosts = blogPostService.getAllBlogPosts();
        return ResponseEntity.ok(blogPosts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPostDto> getBlogPostById(@PathVariable UUID id) {
        BlogPostDto blogPost = blogPostService.getBlogPostById(id);
        return ResponseEntity.ok(blogPost);
    }
}