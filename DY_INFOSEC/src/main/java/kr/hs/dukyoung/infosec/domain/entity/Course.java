package kr.hs.dukyoung.infosec.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String category; // BASIC, ADVANCED, PROJECT, SPECIAL
    
    @Column(length = 50)
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED
    
    @Column(length = 100)
    private String instructor;
    
    @Column(length = 500)
    private String thumbnailImage;
    
    private Integer duration; // in hours
    
    private Integer capacity;
    
    @Builder.Default
    private Integer enrolledCount = 0;
    
    private LocalDate applicationStartDate;
    
    private LocalDate applicationEndDate;
    
    private LocalDate courseStartDate;
    
    private LocalDate courseEndDate;
    
    @Column(length = 20)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, OPEN, CLOSED, COMPLETED
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isOnline = true;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isOffline = false;
    
    @Column(length = 200)
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String syllabus;
    
    @Column(columnDefinition = "TEXT")
    private String prerequisites;
    
    @Column(columnDefinition = "TEXT")
    private String learningOutcomes;
    
    @Column(columnDefinition = "TEXT")
    private String benefits;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Lecture> lectures = new ArrayList<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
