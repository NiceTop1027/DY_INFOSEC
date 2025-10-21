package kr.hs.dukyoung.infosec.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Submission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(length = 500)
    private String fileUrl;
    
    @Column(length = 500)
    private String githubUrl;
    
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED, GRADED, RETURNED
    
    private Integer score;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isLate = false;
    
    private LocalDateTime gradedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    private User gradedBy;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
