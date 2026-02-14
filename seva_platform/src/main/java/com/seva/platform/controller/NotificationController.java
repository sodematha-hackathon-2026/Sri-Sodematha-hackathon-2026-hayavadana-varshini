package com.seva.platform.controller;

import com.seva.platform.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/admin")
    public List<NotificationService.AdminNotification> getAdminNotifications() {
        return notificationService.getAdminNotifications();
    }

    @GetMapping("/user/{mobile}")
    public List<com.seva.platform.model.UserNotification> getUserNotifications(@PathVariable String mobile) {
        return notificationService.getUserNotifications(mobile);
    }
}
