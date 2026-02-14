package com.seva.platform.controller;

import com.seva.platform.model.Seva;
import com.seva.platform.service.SevaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sevas")
@CrossOrigin(origins = "*")
public class SevaController {

    @Autowired
    private SevaService sevaService;

    @GetMapping
    public List<Seva> getAllSevas() {
        return sevaService.getAllSevas();
    }

    @PostMapping("/book")
    public ResponseEntity<String> bookSeva() {
        // Dummy booking endpoint for now, can be expanded later
        return ResponseEntity.ok("Booking Request Received. Proceed to Payment.");
    }

    @PostMapping
    public Seva createSeva(@RequestBody Seva seva) {
        return sevaService.createSeva(seva);
    }
}
