package com.seva.platform.controller;

import com.seva.platform.model.DailyWorship;
import com.seva.platform.repository.DailyWorshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/daily-worship")
@CrossOrigin(origins = "*")
public class DailyWorshipController {

    @Autowired
    private DailyWorshipRepository dailyWorshipRepository;

    @GetMapping
    public List<DailyWorship> getDeities() {
        return dailyWorshipRepository.findAll();
    }
}
