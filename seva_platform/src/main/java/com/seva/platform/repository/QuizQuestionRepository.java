package com.seva.platform.repository;

import com.seva.platform.model.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByLanguage(String language);

    List<QuizQuestion> findByCategory(String category);
}
