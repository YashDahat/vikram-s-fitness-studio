package com.vikramsfitnessstudio.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.vikramsfitnessstudio.model.User;

@Entity
@Table(name = "progress_metrics")
public class ProgressMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String metricName;

    @Column(nullable = false)
    private Double metricValue;

    public ProgressMetric() {
    }

    public ProgressMetric(User user, LocalDate date, String metricName, Double metricValue) {
        this.user = user;
        this.date = date;
        this.metricName = metricName;
        this.metricValue = metricValue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMetricName() {
        return metricName;
    }

    public void setMetricName(String metricName) {
        this.metricName = metricName;
    }

    public Double getMetricValue() {
        return metricValue;
    }

    public void setMetricValue(Double metricValue) {
        this.metricValue = metricValue;
    }
}