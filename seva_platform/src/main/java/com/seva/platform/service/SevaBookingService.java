package com.seva.platform.service;

import com.seva.platform.model.SevaBooking;
import com.seva.platform.repository.SevaBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SevaBookingService {

    @Autowired
    private SevaBookingRepository sevaBookingRepository;

    @Autowired
    private NotificationService notificationService;

    public List<SevaBooking> getAllBookings() {
        return sevaBookingRepository.findAll();
    }

    public SevaBooking createBooking(SevaBooking booking) {
        SevaBooking saved = sevaBookingRepository.save(booking);
        notificationService.notifyAdmin("SEVA_BOOKING", "New Seva Booking: " + saved.getSeva().getName());

        // Notify User
        if (saved.getUser() != null && saved.getUser().getDeviceToken() != null) {
            notificationService.sendPushNotification(
                    saved.getUser().getDeviceToken(),
                    "Seva Booking Received",
                    "Your booking for " + saved.getSeva().getName() + " has been received.",
                    saved.getUser().getMobileNumber());
        }

        return saved;
    }

    public List<SevaBooking> getBookingsByMobile(String mobile) {
        return sevaBookingRepository.findByUserMobileNumber(mobile);
    }

    public SevaBooking updateStatus(Long id, String status, String rejectionReason) {
        SevaBooking booking = sevaBookingRepository.findById((Long) id).orElseThrow();
        booking.setStatus(status);
        if (rejectionReason != null) {
            booking.setRejectionReason(rejectionReason);
        }
        SevaBooking saved = sevaBookingRepository.save(booking);

        // Notify user
        if (saved.getUser() != null && saved.getUser().getDeviceToken() != null) {
            String title = "Seva Booking Update";
            String msg = "Your booking for " + saved.getSeva().getName() + " is now " + status;
            if ("REJECTED".equals(status) && rejectionReason != null) {
                msg += ". Reason: " + rejectionReason;
            }
            notificationService.sendPushNotification(saved.getUser().getDeviceToken(), title, msg,
                    saved.getUser().getMobileNumber());
        }

        return saved;
    }
}
