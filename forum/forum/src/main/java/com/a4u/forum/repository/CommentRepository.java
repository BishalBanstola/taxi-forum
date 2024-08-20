package com.a4u.forum.repository;

import com.a4u.forum.entity.Comment;
import com.a4u.forum.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

    public interface CommentRepository extends JpaRepository<Comment, Long> {
        List<Comment> findByPost(Post post);
    }

