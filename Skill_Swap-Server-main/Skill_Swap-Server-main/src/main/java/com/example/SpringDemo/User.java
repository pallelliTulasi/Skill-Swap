package com.example.SpringDemo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;
    private String phone;
    private String branch;
    private String role;
    private String profileType;

    @Column(length = 1000)
    private String about;

    @Column(name = "is_blocked", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isBlocked = false;

    @ElementCollection
    @CollectionTable(name = "user_skills_to_teach", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "skill")
    private List<String> skillsToTeach;

    @ElementCollection
    @CollectionTable(name = "user_skills_to_learn", joinColumns = @JoinColumn(name = "user_id"))
    @OrderColumn(name = "list_index")
    @Column(name = "skill")
    private List<String> skillsToLearn;

    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getProfileType() { return profileType; }
    public void setProfileType(String profileType) { this.profileType = profileType; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public boolean isBlocked() { return isBlocked; }
    public void setBlocked(boolean blocked) { isBlocked = blocked; }

    public List<String> getSkillsToTeach() { return skillsToTeach; }
    public void setSkillsToTeach(List<String> skillsToTeach) { this.skillsToTeach = skillsToTeach; }

    public List<String> getSkillsToLearn() { return skillsToLearn; }
    public void setSkillsToLearn(List<String> skillsToLearn) { this.skillsToLearn = skillsToLearn; }
}