package com.vikramsfitnessstudio.repository;

import com.vikramsfitnessstudio.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    Optional<BlogPost> findById(UUID id);
    List<BlogPost> findAllByOrderByPublicationDateDesc();
}