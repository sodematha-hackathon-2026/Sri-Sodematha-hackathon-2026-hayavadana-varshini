package com.seva.platform.service;

import com.seva.platform.model.UserNotification;
import com.seva.platform.repository.UserNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class NotificationService {

    // Simple in-memory queue for admin notifications
    private final ConcurrentLinkedQueue<AdminNotification> adminNotifications = new ConcurrentLinkedQueue<>();

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    public void sendPushNotification(String deviceToken, String title, String message, String userMobile) {
        // Simulated Push Notification
        System.out.println("Sending Push to: " + (deviceToken != null ? deviceToken : "ALL"));
        System.out.println("Title: " + title);
        System.out.println("Message: " + message);

        // Save for in-app history
        if (userMobile != null) {
            userNotificationRepository.save(new UserNotification(userMobile, title, message));
        }
    }

    public List<UserNotification> getUserNotifications(String mobile) {
        return userNotificationRepository.findByUserMobileOrderByTimestampDesc(mobile);
    }

    public void notifyAdmin(String type, String message) {
        AdminNotification notification = new AdminNotification(type, message, System.currentTimeMillis());
        adminNotifications.add(notification);

        // Keep only last 50 notifications
        if (adminNotifications.size() > 50) {
            adminNotifications.poll();
        }
    }

    public List<AdminNotification> getAdminNotifications() {
        return new ArrayList<>(adminNotifications);
    }

    public static class AdminNotification {
        public String type;
        public String message;
        public long timestamp;

        public AdminNotification(String type, String message, long timestamp) {
            this.type = type;
            this.message = message;
            this.timestamp = timestamp;
        }
    }
}
