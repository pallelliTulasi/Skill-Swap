package com.example.SpringDemo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    
    @Query("SELECT sr FROM SwapRequest sr WHERE sr.requesterId = :userId OR sr.receiverId = :userId ORDER BY sr.createdAt DESC")
    List<SwapRequest> findByUser(@Param("userId") Long userId);
    
    List<SwapRequest> findByRequesterId(Long requesterId);
    
    List<SwapRequest> findByReceiverId(Long receiverId);
}