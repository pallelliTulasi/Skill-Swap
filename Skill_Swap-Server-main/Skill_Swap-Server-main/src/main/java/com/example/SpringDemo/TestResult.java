package com.example.SpringDemo;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "test_results")
public class TestResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String userName;
    private String userEmail;
    private Long skillId;
    private String skillName;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer easyCorrect;
    private Integer mediumCorrect;
    private Integer hardCorrect;
    private LocalDateTime testDate;
    private Integer viewCount = 0;
    
    // Constructors
    public TestResult() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }
    
    public Integer getEasyCorrect() { return easyCorrect; }
    public void setEasyCorrect(Integer easyCorrect) { this.easyCorrect = easyCorrect; }
    
    public Integer getMediumCorrect() { return mediumCorrect; }
    public void setMediumCorrect(Integer mediumCorrect) { this.mediumCorrect = mediumCorrect; }
    
    public Integer getHardCorrect() { return hardCorrect; }
    public void setHardCorrect(Integer hardCorrect) { this.hardCorrect = hardCorrect; }
    
    public LocalDateTime getTestDate() { return testDate; }
    public void setTestDate(LocalDateTime testDate) { this.testDate = testDate; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
}