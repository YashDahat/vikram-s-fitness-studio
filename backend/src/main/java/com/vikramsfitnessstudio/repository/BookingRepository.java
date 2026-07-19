package com.vikramsfitnessstudio.repository;

import com.vikramsfitnessstudio.model.Booking;
import com.vikramsfitnessstudio.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByFitnessClassIdAndStatusNot(Long fitnessClassId, BookingStatus status);
    Optional<Booking> findByUserIdAndFitnessClassIdAndStatusNot(Long userId, Long fitnessClassId, BookingStatus status);
}