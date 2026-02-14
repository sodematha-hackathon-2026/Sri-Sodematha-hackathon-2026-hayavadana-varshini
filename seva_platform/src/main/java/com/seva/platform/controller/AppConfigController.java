package com.seva.platform.controller;

import com.seva.platform.model.AppConfig;
import com.seva.platform.repository.AppConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/config")
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class AppConfigController {

    @Autowired
    private AppConfigRepository repository;

    @GetMapping
    public List<AppConfig> getAllConfigs() {
        return repository.findAll();
    }

    @PostMapping
    public AppConfig saveConfig(@RequestBody AppConfig config) {
        return repository.save(config);
    }

    @PutMapping("/{key}")
    public AppConfig updateConfig(@PathVariable String key, @RequestBody AppConfig config) {
        config.setConfigKey(key);
        return repository.save(config);
    }

    // Initialize defaults if needed
    @PostMapping("/init")
    public String initDefaults() {
        if (repository.count() == 0) {
            repository.save(new AppConfig("section_history", "History Section", true));
            repository.save(new AppConfig("section_sevas", "Sevas Section", true));
            repository.save(new AppConfig("section_gallery", "Gallery Section", true));
            repository.save(new AppConfig("section_rooms", "Room Booking", true));
            return "Defaults initialized";
        }
        return "Already initialized";
    }
}
