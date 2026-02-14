package com.seva.platform.repository;

import com.seva.platform.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByFlashUpdateTrue();

    List<News> findAllByOrderByPublishedAtDesc();
}
