package com.seva.platform.service;

import com.seva.platform.model.User;
import com.seva.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        if (userRepository.existsByMobileNumber(user.getMobileNumber())) {
            throw new RuntimeException("User with this mobile number already exists");
        }
        return userRepository.save(user);
    }

    public Optional<User> getUserByMobile(String mobile) {
        return userRepository.findByMobileNumber(mobile);
    }

    public User updateUser(Long userId, User updatedUser) {
        return userRepository.findById(userId).map(existingUser -> {
            // Update fields
            existingUser.setName(updatedUser.getName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setAddress(updatedUser.getAddress());
            existingUser.setVolunteer(updatedUser.isVolunteer());
            existingUser.setConsentDataStorage(updatedUser.isConsentDataStorage());
            existingUser.setConsentCommunications(updatedUser.isConsentCommunications());

            if (updatedUser.getDeviceToken() != null) {
                existingUser.setDeviceToken(updatedUser.getDeviceToken());
            }

            // Don't update mobile number or role for security
            // Only update volunteer status if applying for first time
            if (updatedUser.isVolunteer() && existingUser.getVolunteerStatus() == null) {
                existingUser.setVolunteerStatus(User.VolunteerStatus.PENDING);
            }

            return userRepository.save(existingUser);
        }).orElse(null);
    }

    public Optional<User> updateVolunteerStatus(Long userId, User.VolunteerStatus status) {
        return userRepository.findById(userId).map(user -> {
            user.setVolunteerStatus(status);
            if (status == User.VolunteerStatus.APPROVED) {
                user.setVolunteerApprovalDate(java.time.LocalDateTime.now());
                user.setRole(User.Role.VOLUNTEER);
            }
            return userRepository.save(user);
        });
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
