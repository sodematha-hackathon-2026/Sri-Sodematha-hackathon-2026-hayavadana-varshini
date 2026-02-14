package com.seva.platform.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> data = new HashMap<>();

        // Mock data for charts
        List<Map<String, Object>> sevasData = new ArrayList<>();
        sevasData.add(Map.of("name", "Mon", "bookings", 4, "amount", 2000));
        sevasData.add(Map.of("name", "Tue", "bookings", 3, "amount", 1500));
        sevasData.add(Map.of("name", "Wed", "bookings", 7, "amount", 3500));
        sevasData.add(Map.of("name", "Thu", "bookings", 5, "amount", 2500));
        sevasData.add(Map.of("name", "Fri", "bookings", 9, "amount", 4500));
        sevasData.add(Map.of("name", "Sat", "bookings", 12, "amount", 6000));
        sevasData.add(Map.of("name", "Sun", "bookings", 15, "amount", 7500));

        data.put("seva_weekly", sevasData);

        List<Map<String, Object>> donationData = new ArrayList<>();
        donationData.add(Map.of("name", "Week 1", "amount", 10000));
        donationData.add(Map.of("name", "Week 2", "amount", 12000));
        donationData.add(Map.of("name", "Week 3", "amount", 8000));
        donationData.add(Map.of("name", "Week 4", "amount", 15000));

        data.put("donations_monthly", donationData);

        return data;
    }
}
