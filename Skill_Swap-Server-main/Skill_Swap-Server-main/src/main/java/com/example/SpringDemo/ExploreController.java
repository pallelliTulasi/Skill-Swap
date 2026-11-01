package com.example.SpringDemo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/explore")
@CrossOrigin(origins = "http://localhost:3000")
public class ExploreController {
    
    @Autowired
    private TestResultRepository testResultRepository;
    
    // Get all posts with score >= 80%
    @GetMapping("/posts")
    public ResponseEntity<List<TestResult>> getAllPosts() {
        List<TestResult> posts = testResultRepository.findByScoreGreaterThanEqualOrderByTestDateDesc(80);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Search posts
    @GetMapping("/posts/search")
    public ResponseEntity<List<TestResult>> searchPosts(@RequestParam String q) {
        List<TestResult> posts = testResultRepository.searchResults(q);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get posts by skill
    @GetMapping("/posts/skill/{skillName}")
    public ResponseEntity<List<TestResult>> getPostsBySkill(@PathVariable String skillName) {
        List<TestResult> posts = testResultRepository.findBySkillNameAndScoreGreaterThanEqualOrderByTestDateDesc(skillName, 80);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get single post and increment view count
    @GetMapping("/posts/{id}")
    public ResponseEntity<TestResult> getPostById(@PathVariable Long id) {
        TestResult result = testResultRepository.findById(id).orElse(null);
        if (result != null) {
            testResultRepository.incrementViewCount(id);
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // Save new test result (called from Skills page)
    @PostMapping("/posts")
    public ResponseEntity<TestResult> saveTestResult(@RequestBody TestResult testResult) {
        TestResult saved = testResultRepository.save(testResult);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    // Get skill statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        List<TestResult> posts = testResultRepository.findByScoreGreaterThanEqualOrderByTestDateDesc(80);
        Map<String, Long> stats = new HashMap<>();
        for (TestResult post : posts) {
            String skill = post.getSkillName();
            stats.put(skill, stats.getOrDefault(skill, 0L) + 1);
        }
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}