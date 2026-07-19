package com.vikramsfitnessstudio.controller.admin;

import com.vikramsfitnessstudio.dto.BlogPostDto;
import com.vikramsfitnessstudio.service.BlogPostService;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/blog")
public class AdminBlogPostController {

    private final BlogPostService blogPostService;

    public AdminBlogPostController(BlogPostService blogPostService) {
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

    @PostMapping
    public ResponseEntity<BlogPostDto> createBlogPost(@Valid @RequestBody BlogPostDto blogPostDto) {
        BlogPostDto createdBlogPost = blogPostService.createBlogPost(blogPostDto);
        return new ResponseEntity<>(createdBlogPost, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPostDto> updateBlogPost(@PathVariable UUID id, @Valid @RequestBody BlogPostDto blogPostDto) {
        BlogPostDto updatedBlogPost = blogPostService.updateBlogPost(id, blogPostDto);
        return ResponseEntity.ok(updatedBlogPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlogPost(@PathVariable UUID id) {
        blogPostService.deleteBlogPost(id);
        return ResponseEntity.noContent().build();
    }
}