package com.seva.platform.service;

import com.seva.platform.model.QuizQuestion;
import com.seva.platform.model.QuizScore;
import com.seva.platform.repository.QuizQuestionRepository;
import com.seva.platform.repository.QuizScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private QuizScoreRepository quizScoreRepository;

    public List<QuizQuestion> getAllQuestions() {
        return quizQuestionRepository.findAll();
    }

    public List<QuizQuestion> getQuestions(String language) {
        if (language == null || language.isEmpty()) {
            return quizQuestionRepository.findAll();
        }
        return quizQuestionRepository.findByLanguage(language);
    }

    // Get Random 5 or 10 questions for a quiz session
    public List<QuizQuestion> getQuizSession(String language) {
        List<QuizQuestion> all = getQuestions(language);
        Collections.shuffle(all);
        return all.subList(0, Math.min(all.size(), 10));
    }

    public QuizQuestion addQuestion(QuizQuestion question) {
        return quizQuestionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        quizQuestionRepository.deleteById(id);
    }

    public QuizScore submitScore(QuizScore score) {
        return quizScoreRepository.save(score);
    }

    public List<QuizScore> getLeaderboard() {
        return quizScoreRepository.findTopScorers(PageRequest.of(0, 50));
    }
}
