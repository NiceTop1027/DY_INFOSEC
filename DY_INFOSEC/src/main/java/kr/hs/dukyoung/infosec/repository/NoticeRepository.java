package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByCategory(String category);
    List<Notice> findByIsPinned(Boolean isPinned);
    List<Notice> findByIsImportant(Boolean isImportant);
    List<Notice> findAllByOrderByIsPinnedDescCreatedAtDesc();
}
