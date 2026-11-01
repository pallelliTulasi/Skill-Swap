package com.example.SpringDemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository repo;

    // ✅ GET profile by Email
    @GetMapping("/get/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {
        try {
            User user = repo.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + email);
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching profile: " + e.getMessage());
        }
    }

    // ✅ UPDATE PROFILE by Email (FIXED - Properly saves ALL fields)
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {
        try {
            // Find user by email from the request body
            User dbUser = repo.findByEmail(user.getEmail());
            
            if (dbUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with email: " + user.getEmail());
            }

            // Log incoming data for debugging
            System.out.println("Updating profile for: " + user.getEmail());
            System.out.println("Profile Type: " + user.getProfileType());
            System.out.println("About: " + user.getAbout());
            System.out.println("Skills To Teach: " + user.getSkillsToTeach());
            System.out.println("Skills To Learn: " + user.getSkillsToLearn());

            // ✅ Update ALL editable fields
            dbUser.setFirstName(user.getFirstName());
            dbUser.setLastName(user.getLastName());
            dbUser.setPhone(user.getPhone());
            dbUser.setBranch(user.getBranch());
            dbUser.setRole(user.getRole());
            dbUser.setProfileType(user.getProfileType());
            dbUser.setAbout(user.getAbout());
            
            // ✅ CRITICAL: Properly handle skills lists
            if (user.getSkillsToTeach() != null) {
                dbUser.setSkillsToTeach(user.getSkillsToTeach());
            }
            
            if (user.getSkillsToLearn() != null) {
                dbUser.setSkillsToLearn(user.getSkillsToLearn());
            }
            
            // ✅ Save profile image if present
            if (user.getProfileType() != null && !user.getProfileType().isEmpty()) {
                dbUser.setProfileType(user.getProfileType());
            }

            // ✅ Save and return updated user
            User updatedUser = repo.save(dbUser);
            System.out.println("Profile updated successfully for: " + updatedUser.getEmail());
            
            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Update failed: " + e.getMessage());
        }
    }

    // ✅ UPDATE PROFILE by ID (Alternative method)
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfileById(@PathVariable Long id, @RequestBody User user) {
        try {
            User dbUser = repo.findById(id).orElse(null);
            if (dbUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with id: " + id);
            }

            // Update all fields
            dbUser.setFirstName(user.getFirstName());
            dbUser.setLastName(user.getLastName());
            dbUser.setPhone(user.getPhone());
            dbUser.setBranch(user.getBranch());
            dbUser.setRole(user.getRole());
            dbUser.setProfileType(user.getProfileType());
            dbUser.setAbout(user.getAbout());
            dbUser.setSkillsToTeach(user.getSkillsToTeach());
            dbUser.setSkillsToLearn(user.getSkillsToLearn());
            dbUser.setProfileType(user.getProfileType());

            User updatedUser = repo.save(dbUser);
            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Update failed: " + e.getMessage());
        }
    }
}