package com.herlytics.repository;

import com.herlytics.entity.MenstrualLog;
import com.herlytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenstrualLogRepository extends JpaRepository<MenstrualLog, Long> {
    List<MenstrualLog> findByUserOrderByLogDateDesc(User user);
    Optional<MenstrualLog> findFirstByUserOrderByLogDateDesc(User user);
}
