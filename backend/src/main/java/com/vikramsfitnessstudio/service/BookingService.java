package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import com.vikramsfitnessstudio.model.Booking;
import com.vikramsfitnessstudio.model.BookingStatus;
import com.vikramsfitnessstudio.model.FitnessClass;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.BookingRepository;
import com.vikramsfitnessstudio.repository.FitnessClassRepository;
import com.vikramsfitnessstudio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final FitnessClassRepository fitnessClassRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(FitnessClassRepository fitnessClassRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.fitnessClassRepository = fitnessClassRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    public List<FitnessClass> getAllFitnessClasses() {
        return fitnessClassRepository.findAll();
    }

    public FitnessClass getFitnessClassById(Long classId) {
        return fitnessClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Fitness class not found with ID: " + classId));
    }

    @Transactional
    public Booking createBooking(Long userId, Long classId) {
        FitnessClass fitnessClass = getFitnessClassById(classId);

        if (fitnessClass.getCurrentBookedSlots() >= fitnessClass.getMaxCapacity()) {
            throw new IllegalStateException("Fitness class is full.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Optional<Booking> existingBooking = bookingRepository.findByUserIdAndFitnessClassIdAndStatusNot(userId, classId, BookingStatus.CANCELLED);
        if (existingBooking.isPresent()) {
            throw new IllegalStateException("User already has an active booking for this class.");
        }

        Booking booking = new Booking(user, fitnessClass, BookingStatus.CONFIRMED);

        fitnessClass.setCurrentBookedSlots(fitnessClass.getCurrentBookedSlots() + 1);
        fitnessClassRepository.save(fitnessClass);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Booking does not belong to the provided user.");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Booking is not in CONFIRMED status and cannot be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        FitnessClass fitnessClass = booking.getFitnessClass();
        fitnessClass.setCurrentBookedSlots(fitnessClass.getCurrentBookedSlots() - 1);
        fitnessClassRepository.save(fitnessClass);

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public FitnessClass updateFitnessClass(Long classId, FitnessClass updatedClass) {
        FitnessClass existingClass = getFitnessClassById(classId);

        existingClass.setName(updatedClass.getName());
        existingClass.setDescription(updatedClass.getDescription());
        existingClass.setScheduleTime(updatedClass.getScheduleTime());
        existingClass.setInstructor(updatedClass.getInstructor());
        existingClass.setMaxCapacity(updatedClass.getMaxCapacity());
        // currentBookedSlots is managed by booking logic, not directly updated here

        return fitnessClassRepository.save(existingClass);
    }

    public FitnessClass createFitnessClass(FitnessClass newClass) {
        return fitnessClassRepository.save(newClass);
    }

    @Transactional
    public void deleteFitnessClass(Long classId) {
        FitnessClass fitnessClass = getFitnessClassById(classId);

        List<Booking> activeBookings = bookingRepository.findByFitnessClassIdAndStatusNot(classId, BookingStatus.CANCELLED);
        if (!activeBookings.isEmpty()) {
            throw new IllegalStateException("Cannot delete fitness class with active bookings.");
        }

        fitnessClassRepository.deleteById(classId);
    }
}