package com.seva.platform.controller;

import com.seva.platform.model.QuizQuestion;
import com.seva.platform.model.QuizScore;
import com.seva.platform.model.User;
import com.seva.platform.service.QuizService;
import com.seva.platform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    // --- Admin Endpoints ---

    @GetMapping("/all-questions")
    public List<QuizQuestion> getAllQuestions() {
        return quizService.getAllQuestions();
    }

    @PostMapping("/questions")
    public QuizQuestion addQuestion(@RequestBody QuizQuestion question) {
        return quizService.addQuestion(question);
    }

    @DeleteMapping("/questions/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        quizService.deleteQuestion(id);
    }

    // --- App Endpoints ---

    @GetMapping("/play")
    public List<QuizQuestion> startQuiz(@RequestParam(required = false, defaultValue = "EN") String lang) {
        return quizService.getQuizSession(lang);
    }

    @PostMapping("/submit")
    public QuizScore submitScore(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        int score = Integer.parseInt(payload.get("score").toString());
        int total = Integer.parseInt(payload.get("total").toString());

        User user = userService.getUserById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        QuizScore quizScore = new QuizScore();
        quizScore.setUser(user);
        quizScore.setScore(score);
        quizScore.setTotalQuestions(total);
        quizScore.setPlayedAt(LocalDateTime.now());

        return quizService.submitScore(quizScore);
    }

    @GetMapping("/leaderboard")
    public List<QuizScore> getLeaderboard() {
        return quizService.getLeaderboard();
    }
}
