package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Application;
import kr.hs.dukyoung.infosec.domain.entity.Course;
import kr.hs.dukyoung.infosec.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUser(User user);
    List<Application> findByCourse(Course course);
    List<Application> findByStatus(String status);
    Optional<Application> findByUserAndCourse(User user, Course course);
    Boolean existsByUserAndCourse(User user, Course course);
}
