package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStatus(String status);
    List<Course> findByCategory(String category);
    List<Course> findByLevel(String level);
    List<Course> findByStatusAndIsOnline(String status, Boolean isOnline);
}
