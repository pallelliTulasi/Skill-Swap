package com.example.SpringDemo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/swap-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class SwapRequestController {
    
    @Autowired
    private SwapRequestRepository swapRequestRepository;
    
    @GetMapping("/user/{userId}")
    public ApiResponse<List<SwapRequest>> getUserRequests(@PathVariable Long userId) {
        try {
            List<SwapRequest> requests = swapRequestRepository.findByUser(userId);
            System.out.println("Found " + requests.size() + " requests for user " + userId);
            return ApiResponse.success(requests);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Error loading requests: " + e.getMessage());
        }
    }
    
    @PutMapping("/{requestId}/status")
    public ApiResponse<SwapRequest> updateStatus(
            @PathVariable Long requestId,
            @RequestBody StatusUpdateRequest request) {
        try {
            Optional<SwapRequest> optional = swapRequestRepository.findById(requestId);
            if (optional.isPresent()) {
                SwapRequest swapRequest = optional.get();
                swapRequest.setStatus(request.getStatus());
                swapRequestRepository.save(swapRequest);
                return ApiResponse.success("Status updated", swapRequest);
            }
            return ApiResponse.error("Request not found");
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Error updating status: " + e.getMessage());
        }
    }
    
    @PostMapping("/create")
    public ApiResponse<SwapRequest> createRequest(@RequestBody SwapRequest request) {
        try {
            System.out.println("Creating request: " + request);
            request.setStatus("PENDING");
            SwapRequest saved = swapRequestRepository.save(request);
            System.out.println("Saved request with ID: " + saved.getId());
            return ApiResponse.success("Request sent successfully", saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Error creating request: " + e.getMessage());
        }
    }
    
    static class StatusUpdateRequest {
        private String status;
        private Long userId;
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }
}