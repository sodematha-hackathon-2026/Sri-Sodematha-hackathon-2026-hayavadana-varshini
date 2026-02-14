package com.seva.platform.controller;

import com.seva.platform.model.RenovationUpdate;
import com.seva.platform.repository.RenovationUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/renovation")
@CrossOrigin(origins = "*")
public class RenovationUpdateController {

    @Autowired
    private RenovationUpdateRepository renovationUpdateRepository;

    @GetMapping
    public List<RenovationUpdate> getAllUpdates() {
        return renovationUpdateRepository.findAll();
    }

    @PostMapping
    public RenovationUpdate createUpdate(@RequestBody RenovationUpdate update) {
        return renovationUpdateRepository.save(update);
    }

    @PutMapping("/{id}")
    public RenovationUpdate updateUpdate(@PathVariable Long id, @RequestBody RenovationUpdate update) {
        update.setId(id);
        return renovationUpdateRepository.save(update);
    }

    @DeleteMapping("/{id}")
    public void deleteUpdate(@PathVariable Long id) {
        renovationUpdateRepository.deleteById(id);
    }
}
