package com.seva.platform.controller;

import com.seva.platform.model.DevoteeVisit;
import com.seva.platform.repository.DevoteeVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "*")
public class DevoteeVisitController {

    @Autowired
    private DevoteeVisitRepository devoteeVisitRepository;

    @GetMapping
    public List<DevoteeVisit> getVisits(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date != null) {
            return devoteeVisitRepository.findByVisitDate(date);
        }
        return devoteeVisitRepository.findAll();
    }

    @PostMapping
    public DevoteeVisit registerVisit(@RequestBody DevoteeVisit visit) {
        return devoteeVisitRepository.save(visit);
    }
}
