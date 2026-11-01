package com.example.SpringDemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository repo;

    // SIGNUP with validation
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        Map<String, String> errors = new HashMap<>();
        
        // Validate email format
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (user.getEmail() == null || !Pattern.matches(emailRegex, user.getEmail())) {
            errors.put("email", "Invalid email format");
        }
        
        // Check if email exists
        if (repo.findByEmail(user.getEmail()) != null) {
            errors.put("email", "Email already exists");
        }
        
        // Validate password strength
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            errors.put("password", "Password must be at least 6 characters");
        }
        
        // Validate first name
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            errors.put("firstName", "First name is required");
        }
        
        // Validate last name
        if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            errors.put("lastName", "Last name is required");
        }
        
        // If validation errors exist
        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        
        // Save user
        User savedUser = repo.save(user);
        
        // Remove password before sending response
        savedUser.setPassword(null);
        
        return ResponseEntity.ok(savedUser);
    }

    // LOGIN with validation
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        
        // Validate email format
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        if (user.getEmail() == null || !Pattern.matches(emailRegex, user.getEmail())) {
            response.put("error", "Invalid email format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        // Validate password not empty
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            response.put("error", "Password is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        
        User dbUser = repo.findByEmail(user.getEmail());

        if (dbUser == null) {
            response.put("error", "Email not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        if (!dbUser.getPassword().equals(user.getPassword())) {
            response.put("error", "Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        // Remove password before sending response
        dbUser.setPassword(null);
        
        return ResponseEntity.ok(dbUser);
    }
}