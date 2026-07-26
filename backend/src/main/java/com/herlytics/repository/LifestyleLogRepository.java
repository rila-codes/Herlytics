package com.herlytics.repository;

import com.herlytics.entity.LifestyleLog;
import com.herlytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LifestyleLogRepository extends JpaRepository<LifestyleLog, Long> {
    Optional<LifestyleLog> findByUserAndLogDate(User user, LocalDate logDate);
    List<LifestyleLog> findByUserAndLogDateBetweenOrderByLogDateAsc(User user, LocalDate startDate, LocalDate endDate);
}
