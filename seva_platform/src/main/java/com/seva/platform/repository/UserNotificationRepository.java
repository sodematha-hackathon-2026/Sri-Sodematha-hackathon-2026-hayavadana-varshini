package com.seva.platform.repository;

import com.seva.platform.model.UserNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {
    List<UserNotification> findByUserMobileOrderByTimestampDesc(String mobile);
}
