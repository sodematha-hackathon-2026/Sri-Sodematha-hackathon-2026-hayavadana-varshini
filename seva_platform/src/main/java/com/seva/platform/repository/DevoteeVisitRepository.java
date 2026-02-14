package com.seva.platform.repository;

import com.seva.platform.model.DevoteeVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DevoteeVisitRepository extends JpaRepository<DevoteeVisit, Long> {
    List<DevoteeVisit> findByVisitDate(LocalDate visitDate);
}
