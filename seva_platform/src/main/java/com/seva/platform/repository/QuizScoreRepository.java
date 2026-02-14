package com.seva.platform.repository;

import com.seva.platform.model.QuizScore;
import com.seva.platform.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizScoreRepository extends JpaRepository<QuizScore, Long> {
    List<QuizScore> findByUser(User user);

    // Get Top Scorers for Leaderboard
    @Query("SELECT qs FROM QuizScore qs ORDER BY qs.score DESC, qs.playedAt ASC")
    List<QuizScore> findTopScorers(Pageable pageable);
}
