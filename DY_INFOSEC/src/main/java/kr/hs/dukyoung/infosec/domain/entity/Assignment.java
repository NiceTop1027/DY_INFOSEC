package kr.hs.dukyoung.infosec.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Assignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(length = 50)
    private String type; // PRACTICE, PROJECT, QUIZ, CTF
    
    private Integer maxScore;
    
    private LocalDateTime startDate;
    
    private LocalDateTime dueDate;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean allowLateSubmission = false;
    
    private Integer latePenaltyPercent;
    
    @Column(length = 500)
    private String attachmentUrl;
    
    @Column(columnDefinition = "TEXT")
    private String guidelines;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPublished = false;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
