package com.seva.platform.controller;

import com.seva.platform.model.RoomRequest;
import com.seva.platform.service.RoomRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomRequestController {

    @Autowired
    private RoomRequestService roomRequestService;

    @GetMapping
    public List<RoomRequest> getAllRequests() {
        return roomRequestService.getAllRequests();
    }

    @PostMapping("/book")
    public ResponseEntity<RoomRequest> bookRoom(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomRequestService.createRequest(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RoomRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam RoomRequest.Status status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(roomRequestService.updateStatus(id, status, reason));
    }

    @GetMapping("/user/{mobile}")
    public List<RoomRequest> getByUser(@PathVariable String mobile) {
        return roomRequestService.getRequestsByMobile(mobile);
    }
}
