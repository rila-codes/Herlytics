package com.herlytics.repository;

import com.herlytics.entity.Assessment;
import com.herlytics.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserOrderByCreatedAtDesc(User user);
    Optional<Assessment> findFirstByUserOrderByCreatedAtDesc(User user);
}
