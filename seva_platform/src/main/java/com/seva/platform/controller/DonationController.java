package com.seva.platform.controller;

import com.seva.platform.model.Donation;
import com.seva.platform.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private com.seva.platform.service.NotificationService notificationService;

    @Autowired
    private com.seva.platform.service.UserService userService;

    @GetMapping
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @PostMapping
    public Donation createDonation(@RequestBody Donation donation) {
        if (donation.getTransactionId() == null) {
            donation.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (donation.getTimestamp() == null) {
            donation.setTimestamp(LocalDateTime.now());
        }
        if (donation.getStatus() == null) {
            donation.setStatus("SUCCESS");
        }
        Donation saved = donationRepository.save(donation);

        // Notify Admin
        notificationService.notifyAdmin("DONATION",
                "New Donation of ₹" + saved.getAmount() + " by " + saved.getDonorName());

        // Notify User if we have mobile
        if (saved.getMobile() != null) {
            userService.getUserByMobile(saved.getMobile()).ifPresent(user -> {
                if (user.getDeviceToken() != null) {
                    notificationService.sendPushNotification(
                            user.getDeviceToken(),
                            "Donation Received",
                            "Thank you for your donation of ₹" + saved.getAmount(),
                            user.getMobileNumber());
                }
            });
        }

        return saved;
    }

    @DeleteMapping("/{id}")
    public void deleteDonation(@PathVariable Long id) {
        donationRepository.deleteById(id);
    }
}
