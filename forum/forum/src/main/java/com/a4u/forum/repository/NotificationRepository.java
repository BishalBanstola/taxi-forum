package com.a4u.forum.repository;

import com.a4u.forum.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Find notifications by userId
    List<Notification> findByUserId(Long userId);

    // Optional: Method to find unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}
