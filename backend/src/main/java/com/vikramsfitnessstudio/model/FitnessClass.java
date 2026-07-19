package com.vikramsfitnessstudio.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fitness_classes")
public class FitnessClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime scheduleTime;

    @Column(nullable = false)
    private String instructor;

    @Column(nullable = false)
    private int maxCapacity;

    @Column(nullable = false)
    private int currentBookedSlots = 0;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getScheduleTime() {
        return scheduleTime;
    }

    public void setScheduleTime(LocalDateTime scheduleTime) {
        this.scheduleTime = scheduleTime;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public int getCurrentBookedSlots() {
        return currentBookedSlots;
    }

    public void setCurrentBookedSlots(int currentBookedSlots) {
        this.currentBookedSlots = currentBookedSlots;
    }
}