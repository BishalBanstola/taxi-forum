package com.a4u.forum.service;

import com.a4u.forum.entity.Comment;
import com.a4u.forum.entity.Post;
import com.a4u.forum.entity.UserInfo;
import com.a4u.forum.repository.CommentRepository;
import com.a4u.forum.repository.PostRepository;
import com.a4u.forum.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserInfoRepository userRepository;
    @Autowired
    private KafkaProducerService kafkaProducerService;
    // Create a new comment
    public Comment createComment(Long postId, Comment comment, String username) {
        Optional<Post> post = postRepository.findById(postId);
        Optional<UserInfo> user = userRepository.findByName(username);
        if (post.isPresent() && user.isPresent()) {
            comment.setPost(post.get());
            comment.setUser(user.get());
            comment.setCreatedAt(LocalDateTime.now());
            Comment savedComment = commentRepository.save(comment);
            // Publish event to Kafka
            String message = "postId:" + postId + "userName:" + username;
            kafkaProducerService.sendMessage(message);
            return savedComment;
        }
        return null;
    }
    // Get comments by post
    public List<Comment> getCommentsByPost(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        return post.map(commentRepository::findByPost).orElse(null);
    }
    // Delete a comment
    public void deleteComment(Long id) throws Exception {

        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();

            // Check if the authenticated user is the creator of the comment
            if (comment.getUser().getName().equals(currentUsername)) {
                commentRepository.deleteById(id);
            } else {
                throw new Exception("You are not authorized to delete this comment");
            }
        } else {
            throw new Exception("Comment not found with id " + id);
        }
    }

    // Update a comment
    public Comment updateComment(Long id, Comment updatedComment) throws Exception {
        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();

            // Check if the authenticated user is the creator of the comment
            if (comment.getUser().getName().equals(currentUsername)) {
                comment.setContent(updatedComment.getContent());
                return commentRepository.save(comment);
            } else {
                throw new Exception("You are not authorized to update this comment");
            }
        } else {
            throw new Exception("Comment not found with id " + id);
        }
    }
}