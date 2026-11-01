package com.example.SpringDemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // allow requests from frontend
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ApiResponse.success(users);
    }

    // Get all skills users want to learn
    @GetMapping("/skills-to-learn")
    public ApiResponse<List<String>> getAllSkillsToLearn() {
        List<String> skills = userRepository.findAll()
                .stream()
                .flatMap(user -> user.getSkillsToLearn().stream())
                .distinct()
                .collect(Collectors.toList());
        return ApiResponse.success(skills);
    }

    // Get all skills users can teach
    @GetMapping("/skills-to-teach")
    public ApiResponse<List<String>> getAllSkillsToTeach() {
        List<String> skills = userRepository.findAll()
                .stream()
                .flatMap(user -> user.getSkillsToTeach().stream())
                .distinct()
                .collect(Collectors.toList());
        return ApiResponse.success(skills);
    }
}
