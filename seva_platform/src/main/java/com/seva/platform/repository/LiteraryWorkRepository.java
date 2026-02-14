package com.seva.platform.repository;

import com.seva.platform.model.LiteraryWork;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiteraryWorkRepository extends JpaRepository<LiteraryWork, Long> {
}
