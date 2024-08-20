package com.a4u.forum.controller;

import com.a4u.forum.entity.Comment;
import com.a4u.forum.entity.Post;
import com.a4u.forum.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;
    // Create a new comment
    @PostMapping
    public Comment createComment(@PathVariable Long postId, @RequestBody Comment
            comment, @RequestParam String username) {
        return commentService.createComment(postId, comment, username);
    }
    // Get comments by post
    @GetMapping
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPost(postId);
    }
    @PutMapping("/{id}")
    public Comment updatedComment(@PathVariable Long id, @RequestBody Comment updatedComment) throws Exception {
        return commentService.updateComment(id, updatedComment);
    }
    // Delete a comment
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) throws Exception {
        commentService.deleteComment(id);
    }
}