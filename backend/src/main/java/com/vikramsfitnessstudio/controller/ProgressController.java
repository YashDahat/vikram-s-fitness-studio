package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.ProgressMetricDto;
import com.vikramsfitnessstudio.dto.WorkoutLogDto;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.service.ProgressService;
import com.vikramsfitnessstudio.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import com.vikramsfitnessstudio.model.User;

@RestController
@RequestMapping("/api/v1/progress")
public class ProgressController {

    private final ProgressService progressService;
    private final JwtUtil jwtUtil; // Injected for completeness, though Principal provides username

    @Autowired
    public ProgressController(ProgressService progressService, JwtUtil jwtUtil) {
        this.progressService = progressService;
        this.jwtUtil = jwtUtil;
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        // In a real application, the Principal would typically contain the user ID directly
        // or we'd fetch the User entity based on the username.
        // For this exercise, we assume a mechanism to get the ID from the principal's name.
        // This is a placeholder; actual implementation depends on Spring Security setup.
        // For now, we'll assume the principal name is the username and we need to resolve it to an ID.
        // Since the service methods take a Long userId, we need to convert.
        // This part is usually handled by a custom UserDetailsService or by storing ID in JWT claims.
        // Given the current setup, we'll mock a user ID for demonstration or assume it's part of the principal.
        // For the purpose of this exercise, we will assume the Principal name can be parsed as a Long ID.
        // In a production system, this would involve looking up the user by username from the database
        // or having the user ID directly in the JWT claims.
        try {
            return Long.parseLong(principal.getName());
        } catch (NumberFormatException e) {
            // Handle cases where principal.getName() is not a numeric user ID
            // This indicates a mismatch between how user IDs are stored/retrieved and expected.
            // For now, throwing an exception or returning a default/error ID.
            // A more robust solution would involve a UserDetailsService to get the User object.
            throw new IllegalArgumentException("Invalid user ID format in principal: " + principal.getName());
        }
    }

    @PostMapping("/workouts")
    public ResponseEntity<WorkoutLogDto> logWorkout(Principal principal, @Valid @RequestBody WorkoutLogDto workoutLogDto) {
        try {
            Long userId = getUserIdFromPrincipal(principal);
            WorkoutLogDto createdWorkoutLog = progressService.logWorkout(userId, workoutLogDto);
            return new ResponseEntity<>(createdWorkoutLog, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/workouts")
    public ResponseEntity<List<WorkoutLogDto>> getWorkoutLogs(Principal principal) {
        try {
            Long userId = getUserIdFromPrincipal(principal);
            List<WorkoutLogDto> workoutLogs = progressService.getWorkoutLogsByUserId(userId);
            return new ResponseEntity<>(workoutLogs, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/metrics")
    public ResponseEntity<ProgressMetricDto> logProgressMetric(Principal principal, @Valid @RequestBody ProgressMetricDto progressMetricDto) {
        try {
            Long userId = getUserIdFromPrincipal(principal);
            ProgressMetricDto createdProgressMetric = progressService.logProgressMetric(userId, progressMetricDto);
            return new ResponseEntity<>(createdProgressMetric, HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/metrics")
    public ResponseEntity<List<ProgressMetricDto>> getProgressMetrics(Principal principal, @RequestParam String metricName) {
        try {
            Long userId = getUserIdFromPrincipal(principal);
            List<ProgressMetricDto> progressMetrics = progressService.getProgressMetricsByUserIdAndMetricName(userId, metricName);
            return new ResponseEntity<>(progressMetrics, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}