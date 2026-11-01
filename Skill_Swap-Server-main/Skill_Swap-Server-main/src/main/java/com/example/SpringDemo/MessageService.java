package com.example.SpringDemo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    // Save message with user details auto-populated
    public Message saveMessage(Message message) {
        // Get sender details
        User sender = userRepository.findById(message.getSenderId()).orElse(null);
        if (sender != null) {
            message.setSenderFullName(sender.getFirstName() + " " + sender.getLastName());
            message.setSenderUsername(sender.getEmail());
        }

        // Get receiver details
        User receiver = userRepository.findById(message.getReceiverId()).orElse(null);
        if (receiver != null) {
            message.setReceiverFullName(receiver.getFirstName() + " " + receiver.getLastName());
            message.setReceiverUsername(receiver.getEmail());
        }

        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);
        message.setStatus("sent");
        
        return messageRepository.save(message);
    }

    // Get all messages
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // Delete message
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
}