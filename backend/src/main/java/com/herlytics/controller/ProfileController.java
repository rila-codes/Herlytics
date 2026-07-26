package com.herlytics.controller;

import com.herlytics.dto.MessageResponse;
import com.herlytics.dto.RegisterRequest;
import com.herlytics.entity.User;
import com.herlytics.security.UserDetailsImpl;
import com.herlytics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private UserService userService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
    }

    @GetMapping
    public ResponseEntity<?> getProfile() {
        User user = getCurrentUser();
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("email", user.getEmail());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("createdAt", user.getCreatedAt());
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        User user = getCurrentUser();
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");

        if (firstName == null || firstName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("First name is required"));
        }

        userService.updateProfile(user, firstName, lastName);
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
    }
}
