package kr.hs.dukyoung.infosec.repository;

import kr.hs.dukyoung.infosec.domain.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByCategory(String category);
    List<Faq> findByIsPublished(Boolean isPublished);
    List<Faq> findByIsPublishedOrderByOrderIndexAsc(Boolean isPublished);
}
