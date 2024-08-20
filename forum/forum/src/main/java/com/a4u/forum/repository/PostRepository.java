package com.a4u.forum.repository;

import com.a4u.forum.entity.Post;
import com.a4u.forum.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(UserInfo user);

}
