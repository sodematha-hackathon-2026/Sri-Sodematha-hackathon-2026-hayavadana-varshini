package com.seva.platform.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/panchanga")
@CrossOrigin(origins = "*")
public class PanchangaController {

    @GetMapping
    public Map<String, Object> getTodaysPanchanga() {
        Map<String, Object> data = new HashMap<>();
        LocalDate today = LocalDate.now();
        data.put("date", today.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")));
        data.put("location", "Sode, Sirsi, Karnataka");

        // Simulated Tithi Data
        Map<String, String> tithi = new HashMap<>();
        tithi.put("name", "Ekadashi");
        tithi.put("ends", "06:45 PM");
        data.put("tithi", tithi);

        // Simulated Nakshatra Data
        Map<String, String> nakshatra = new HashMap<>();
        nakshatra.put("name", "Mrigashira");
        nakshatra.put("ends", "08:20 PM");
        data.put("nakshatra", nakshatra);

        // Simulated Yoga Data
        Map<String, String> yoga = new HashMap<>();
        yoga.put("name", "Sadhya");
        yoga.put("ends", "04:10 PM");
        data.put("yoga", yoga);

        // Simulated Karana Data
        Map<String, String> karana = new HashMap<>();
        karana.put("name", "Vanija");
        karana.put("ends", "06:45 PM");
        data.put("karana", karana);

        // Timing Data
        Map<String, String> rahuKala = new HashMap<>();
        rahuKala.put("start", "07:30 AM");
        rahuKala.put("end", "09:00 AM");
        data.put("rahuKala", rahuKala);

        Map<String, String> gulikaKala = new HashMap<>();
        gulikaKala.put("start", "01:30 PM");
        gulikaKala.put("end", "03:00 PM");
        data.put("gulikaKala", gulikaKala);

        Map<String, String> yamaGanda = new HashMap<>();
        yamaGanda.put("start", "10:30 AM");
        yamaGanda.put("end", "12:00 PM");
        data.put("yamaGanda", yamaGanda);

        data.put("sunrise", "06:45 AM");
        data.put("sunset", "06:15 PM");

        data.put("festivals", Arrays.asList("Sri Madhvacharya Jayanti", "Special Rathotsava preparation"));

        Map<String, String> m1 = new HashMap<>();
        m1.put("name", "Abhijit Muhurtha");
        m1.put("time", "11:45 AM - 12:30 PM");
        data.put("muhurthas", Arrays.asList(m1));

        return data;
    }
}
