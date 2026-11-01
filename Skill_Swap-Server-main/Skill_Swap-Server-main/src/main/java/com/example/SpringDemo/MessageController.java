package com.example.SpringDemo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {
    
    @Autowired
    private MessageRepository messageRepository;
    @GetMapping("/all")
public ApiResponse<List<Message>> getAllMessages() {
    return ApiResponse.success(messageRepository.findAll());
}
    @GetMapping("/conversation/{userId1}/{userId2}")
    public ApiResponse<List<Message>> getConversation(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        try {
            System.out.println("Getting conversation between " + userId1 + " and " + userId2);
            List<Message> messages = messageRepository.findConversation(userId1, userId2);
            System.out.println("Found " + messages.size() + " messages");
            return ApiResponse.success(messages);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Error loading messages: " + e.getMessage());
        }
    }
    
    @PostMapping("/send")
    public ApiResponse<Message> sendMessage(@RequestBody Message message) {
        try {
            System.out.println("Sending message: " + message.getContent());
            message.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            message.setRead(false);
            
            Message saved = messageRepository.save(message);
            System.out.println("Message saved with ID: " + saved.getId());
            return ApiResponse.success("Message sent", saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Error sending message: " + e.getMessage());
        }
    }
}
