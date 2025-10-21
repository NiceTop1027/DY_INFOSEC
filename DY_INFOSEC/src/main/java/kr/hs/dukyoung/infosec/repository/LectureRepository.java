package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Course;
import kr.hs.dukyoung.infosec.domain.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourse(Course course);
    List<Lecture> findByCourseAndIsPublished(Course course, Boolean isPublished);
    List<Lecture> findByCourseOrderByOrderIndexAsc(Course course);
}
