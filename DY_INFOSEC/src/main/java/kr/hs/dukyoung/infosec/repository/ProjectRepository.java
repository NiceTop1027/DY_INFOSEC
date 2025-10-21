package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Course;
import kr.hs.dukyoung.infosec.domain.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCourse(Course course);
    List<Project> findByStatus(String status);
}
