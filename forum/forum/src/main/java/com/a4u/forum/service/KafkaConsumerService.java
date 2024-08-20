package com.a4u.forum.service;

import com.a4u.forum.entity.Notification;
import com.a4u.forum.entity.Post;
import com.a4u.forum.entity.UserInfo;
import com.a4u.forum.repository.NotificationRepository;
import com.a4u.forum.repository.PostRepository;
import com.a4u.forum.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class KafkaConsumerService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @KafkaListener(topics = "comment-notifications", groupId = "comment-notification-group")
    public void consume(String message) {
        String[] parts = message.split(" ");
        Long postId = Long.parseLong(parts[0].split(":")[1]);
        String username = parts[1].split(":")[1];

        // Fetch the user and post based on the extracted values
        Optional<UserInfo> userOptional = userInfoRepository.findByName(username);
        Optional<Post> postOptional = postRepository.findById(postId);

        if (userOptional.isPresent() && postOptional.isPresent()) {
            UserInfo user = userOptional.get();
            Post post = postOptional.get();

            // Create the notification message
            String notificationMessage = "New comment on your post: " + post.getTitle();

            // Create a new Notification entity
            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setMessage(notificationMessage);
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);

            // Save the notification to the database
            notificationRepository.save(notification);

            // Log the successful processing
            System.out.println("Notification created for user " + username + ": " + notificationMessage);
        } else {
            System.out.println("User or Post not found for message: " + message);
        }
    }

}
