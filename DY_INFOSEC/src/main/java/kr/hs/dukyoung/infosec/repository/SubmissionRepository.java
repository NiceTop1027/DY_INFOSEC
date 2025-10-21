package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Assignment;
import kr.hs.dukyoung.infosec.domain.entity.Submission;
import kr.hs.dukyoung.infosec.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignment(Assignment assignment);
    List<Submission> findByUser(User user);
    Optional<Submission> findByAssignmentAndUser(Assignment assignment, User user);
    List<Submission> findByStatus(String status);
}
