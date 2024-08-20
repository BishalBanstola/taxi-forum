package com.a4u.forum.service;


import com.a4u.forum.entity.Post;
import com.a4u.forum.entity.UserInfo;
import com.a4u.forum.entity.UserInfo;
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
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserInfoRepository userRepository;

    // Create a new post
    public Post createPost(Post post, String username) {
        Optional<UserInfo> userOptional = userRepository.findByName(username);
        if (userOptional.isPresent()) {
            UserInfo user = userOptional.get();
            post.setUser(user);
            post.setLikeCount(0);
            post.setCreatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }
        return null;
    }

    // Get a post by ID
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get posts by user
    public List<Post> getPostsByUser(String username) {
        Optional<UserInfo> userOptional = userRepository.findByName(username);
        return userOptional.map(user -> postRepository.findByUser(user)).orElse(null);
    }

    // Update a post
    public Post updatePost(Long id, Post updatedPost) throws Exception {
        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();

            // Check if the authenticated user is the creator of the post
            if (post.getUser().getName().equals(currentUsername)) {
                post.setTitle(updatedPost.getTitle());
                post.setContent(updatedPost.getContent());
                return postRepository.save(post);
            } else {
                throw new Exception("You are not authorized to update this post");
            }
        }
        return null;
    }

    // Delete a post
    public void deletePost(Long id) throws Exception {

        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = ((UserDetails) authentication.getPrincipal()).getUsername();

        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();

            // Check if the authenticated user is the creator of the post
            if (post.getUser().getName().equals(currentUsername)) {
                postRepository.deleteById(id);
            } else {
                throw new Exception("You are not authorized to delete this post");
            }
        } else {
            throw new Exception("Post not found with id " + id);
        }
    }
}
