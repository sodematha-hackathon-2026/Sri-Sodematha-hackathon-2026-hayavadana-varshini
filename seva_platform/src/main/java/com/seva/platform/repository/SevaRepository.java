package com.seva.platform.repository;

import com.seva.platform.model.Seva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SevaRepository extends JpaRepository<Seva, Long> {
    List<Seva> findByActiveTrue();

    List<Seva> findByLocationAndActiveTrue(Seva.Location location);
}
