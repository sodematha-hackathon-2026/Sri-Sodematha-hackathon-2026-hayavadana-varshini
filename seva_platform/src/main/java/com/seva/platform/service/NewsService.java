package com.seva.platform.service;

import com.seva.platform.model.News;
import com.seva.platform.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByPublishedAtDesc();
    }

    public List<News> getFlashUpdates() {
        return newsRepository.findByFlashUpdateTrue();
    }

    public News createNews(News news) {
        return newsRepository.save(news);
    }

    public void deleteNews(Long id) {
        newsRepository.deleteById(id);
    }
}
