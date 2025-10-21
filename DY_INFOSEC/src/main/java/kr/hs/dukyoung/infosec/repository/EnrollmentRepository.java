package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Course;
import kr.hs.dukyoung.infosec.domain.entity.Enrollment;
import kr.hs.dukyoung.infosec.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUser(User user);
    List<Enrollment> findByCourse(Course course);
    List<Enrollment> findByUserAndStatus(User user, String status);
    Optional<Enrollment> findByUserAndCourse(User user, Course course);
    Boolean existsByUserAndCourse(User user, Course course);
}
