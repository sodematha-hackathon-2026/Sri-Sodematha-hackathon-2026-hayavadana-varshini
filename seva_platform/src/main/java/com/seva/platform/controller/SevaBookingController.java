package com.seva.platform.controller;

import com.seva.platform.model.SevaBooking;
import com.seva.platform.service.SevaBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seva-bookings")
@CrossOrigin(origins = "*")
public class SevaBookingController {

    @Autowired
    private SevaBookingService sevaBookingService;

    @GetMapping
    public List<SevaBooking> getAll() {
        return sevaBookingService.getAllBookings();
    }

    @PostMapping
    public ResponseEntity<SevaBooking> create(@RequestBody SevaBooking booking) {
        return ResponseEntity.ok(sevaBookingService.createBooking(booking));
    }

    @GetMapping("/user/{mobile}")
    public List<SevaBooking> getByUser(@PathVariable String mobile) {
        return sevaBookingService.getBookingsByMobile(mobile);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SevaBooking> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(sevaBookingService.updateStatus(id, status, reason));
    }
}
