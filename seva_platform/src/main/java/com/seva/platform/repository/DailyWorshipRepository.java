package com.seva.platform.repository;

import com.seva.platform.model.DailyWorship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyWorshipRepository extends JpaRepository<DailyWorship, Long> {
}
