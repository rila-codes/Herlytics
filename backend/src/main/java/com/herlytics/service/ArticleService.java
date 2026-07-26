package com.herlytics.service;

import com.herlytics.entity.Article;
import com.herlytics.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public List<Article> getAllArticles(String category, String searchQuery) {
        if (searchQuery != null && !searchQuery.trim().isEmpty()) {
            return articleRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(searchQuery, searchQuery);
        }
        
        if (category != null && !category.trim().isEmpty()) {
            return articleRepository.findByCategory(category);
        }

        return articleRepository.findAll();
    }

    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }
}
