package com.seva.platform.controller;

import com.seva.platform.model.User;
import com.seva.platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/mobile/{mobile}")
    public ResponseEntity<User> getUserByMobile(@PathVariable String mobile) {
        return userService.getUserByMobile(mobile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Validate required fields
            if (user.getMobileNumber() == null || user.getMobileNumber().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Mobile number is required");
            }

            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }

            // Handle empty email - set to null to avoid unique constraint issues
            if (user.getEmail() != null && user.getEmail().trim().isEmpty()) {
                user.setEmail(null);
            }

            // If applying for volunteer, set status to PENDING
            if (user.isVolunteer()) {
                user.setVolunteerStatus(User.VolunteerStatus.PENDING);
            }

            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while creating the user");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            // Validate required fields
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name is required");
            }

            // Handle empty email - set to null to avoid unique constraint issues
            if (user.getEmail() != null && user.getEmail().trim().isEmpty()) {
                user.setEmail(null);
            }

            // If applying for volunteer, set status to PENDING
            if (user.isVolunteer() && user.getVolunteerStatus() == null) {
                user.setVolunteerStatus(User.VolunteerStatus.PENDING);
            }

            User updatedUser = userService.updateUser(id, user);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating the user");
        }
    }

    @PutMapping("/{id}/approve-volunteer")
    public ResponseEntity<User> approveVolunteer(@PathVariable Long id) {
        return userService.updateVolunteerStatus(id, User.VolunteerStatus.APPROVED)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportUsers() {
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Mobile,Email,Role,Volunteer,Volunteer Status\n");
        List<User> users = userService.getAllUsers();
        for (User u : users) {
            csv.append(u.getId()).append(",")
                    .append(escapeSpecialCharacters(u.getName())).append(",")
                    .append(u.getMobileNumber()).append(",")
                    .append(escapeSpecialCharacters(u.getEmail())).append(",")
                    .append(u.getRole()).append(",")
                    .append(u.isVolunteer()).append(",")
                    .append(u.getVolunteerStatus()).append("\n");
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=users.csv")
                .header("Content-Type", "text/csv")
                .body(csv.toString());
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null)
            return "";
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
