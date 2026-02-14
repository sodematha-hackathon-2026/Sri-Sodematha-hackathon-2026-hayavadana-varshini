package com.seva.platform.repository;

import com.seva.platform.model.PlaceToVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceToVisitRepository extends JpaRepository<PlaceToVisit, Long> {
}
