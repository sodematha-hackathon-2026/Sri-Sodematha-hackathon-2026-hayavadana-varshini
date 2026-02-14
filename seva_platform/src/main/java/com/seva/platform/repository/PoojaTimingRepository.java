package com.seva.platform.repository;

import com.seva.platform.model.PoojaTiming;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PoojaTimingRepository extends JpaRepository<PoojaTiming, Long> {
    List<PoojaTiming> findByLanguage(String language);
}
