package com.vikramsfitnessstudio.repository;

import com.vikramsfitnessstudio.model.ProgressMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressMetricRepository extends JpaRepository<ProgressMetric, Long> {
    List<ProgressMetric> findByUserIdAndMetricNameOrderByDateDesc(Long userId, String metricName);
}