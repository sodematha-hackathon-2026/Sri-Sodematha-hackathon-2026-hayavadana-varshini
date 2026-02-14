package com.seva.platform.service;

import com.seva.platform.model.RoomRequest;
import com.seva.platform.repository.RoomRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomRequestService {

    @Autowired
    private RoomRequestRepository roomRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    public List<RoomRequest> getAllRequests() {
        return roomRequestRepository.findAll();
    }

    public RoomRequest createRequest(RoomRequest request) {
        RoomRequest saved = roomRequestRepository.save(request);
        notificationService.notifyAdmin("ROOM_REQUEST", "New Room Request from: " + saved.getDevoteeName());

        // Notify User
        userService.getUserByMobile(saved.getMobileNumber()).ifPresent(user -> {
            if (user.getDeviceToken() != null) {
                notificationService.sendPushNotification(
                        user.getDeviceToken(),
                        "Room Request Received",
                        "We have received your room request. We will update you shortly.",
                        user.getMobileNumber());
            }
        });
        return saved;
    }

    public RoomRequest updateStatus(Long id, RoomRequest.Status status, String rejectionReason) {
        RoomRequest request = roomRequestRepository.findById((Long) id).orElseThrow();
        request.setStatus(status);
        if (rejectionReason != null) {
            request.setRejectionReason(rejectionReason);
        }
        RoomRequest saved = roomRequestRepository.save(request);

        // Notify user
        userService.getUserByMobile(saved.getMobileNumber()).ifPresent(user -> {
            if (user.getDeviceToken() != null) {
                String title = "Room Booking Update";
                String msg = "Your room request status is now " + status;
                if (status == RoomRequest.Status.REJECTED && rejectionReason != null) {
                    msg += ". Reason: " + rejectionReason;
                }
                notificationService.sendPushNotification(user.getDeviceToken(), title, msg, user.getMobileNumber());
            }
        });

        return saved;
    }

    public List<RoomRequest> getRequestsByMobile(String mobile) {
        return roomRequestRepository.findByMobileNumber(mobile);
    }
}
