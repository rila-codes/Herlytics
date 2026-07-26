package com.herlytics.repository;

import com.herlytics.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByIsPcosFriendly(Boolean isPcosFriendly);
}
