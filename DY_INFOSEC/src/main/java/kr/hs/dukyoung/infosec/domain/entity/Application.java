package kr.hs.dukyoung.infosec.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(length = 50, nullable = false)
    private String applicationNumber;
    
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED, DOCUMENT_PASS, DOCUMENT_FAIL, INTERVIEW_SCHEDULED, FINAL_PASS, FINAL_FAIL
    
    @Column(columnDefinition = "TEXT")
    private String motivation;
    
    @Column(columnDefinition = "TEXT")
    private String studyPlan;
    
    @Column(columnDefinition = "TEXT")
    private String careerGoal;
    
    @Column(columnDefinition = "TEXT")
    private String technicalSkills;
    
    @Column(columnDefinition = "TEXT")
    private String certifications;
    
    @Column(columnDefinition = "TEXT")
    private String projects;
    
    @Column(length = 500)
    private String resumeFile;
    
    @Column(length = 500)
    private String portfolioFile;
    
    private Integer documentScore;
    
    private Integer interviewScore;
    
    private Integer totalScore;
    
    @Column(columnDefinition = "TEXT")
    private String reviewComment;
    
    private LocalDateTime interviewScheduledAt;
    
    private LocalDateTime resultAnnouncedAt;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
