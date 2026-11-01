package com.example.SpringDemo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    
    // Get all results with score >= 80%
    List<TestResult> findByScoreGreaterThanEqualOrderByTestDateDesc(Integer score);
    
    // Search by username or skill name
    @Query("SELECT t FROM TestResult t WHERE (LOWER(t.userName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.skillName) LIKE LOWER(CONCAT('%', :search, '%'))) AND t.score >= 80 ORDER BY t.testDate DESC")
    List<TestResult> searchResults(@Param("search") String search);
    
    // Get results by specific skill
    List<TestResult> findBySkillNameAndScoreGreaterThanEqualOrderByTestDateDesc(String skillName, Integer score);
    
    // Increment view count
    @Modifying
    @Transactional
    @Query("UPDATE TestResult t SET t.viewCount = t.viewCount + 1 WHERE t.id = :id")
    void incrementViewCount(@Param("id") Long id);
}