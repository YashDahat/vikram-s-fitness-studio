package com.vikramsfitnessstudio.controller;

import com.vikramsfitnessstudio.dto.BookingDto;
import com.vikramsfitnessstudio.dto.CreateBookingRequest;
import com.vikramsfitnessstudio.dto.FitnessClassDto;
import com.vikramsfitnessstudio.model.Booking;
import com.vikramsfitnessstudio.model.FitnessClass;
import com.vikramsfitnessstudio.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/classes")
    public ResponseEntity<List<FitnessClassDto>> getAllFitnessClasses() {
        List<FitnessClass> fitnessClasses = bookingService.getAllFitnessClasses();
        List<FitnessClassDto> fitnessClassDtos = fitnessClasses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(fitnessClassDtos, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/bookings")
    public ResponseEntity<BookingDto> createBooking(Principal principal, @Valid @RequestBody CreateBookingRequest request) {
        Long userId = Long.valueOf(principal.getName()); // Assuming principal.getName() returns userId
        Booking booking = bookingService.createBooking(userId, request.getFitnessClassId());
        return new ResponseEntity<>(convertToDto(booking), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/bookings/my-bookings")
    public ResponseEntity<List<BookingDto>> getUserBookings(Principal principal) {
        Long userId = Long.valueOf(principal.getName());
        List<Booking> bookings = bookingService.getUserBookings(userId);
        List<BookingDto> bookingDtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDtos, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<BookingDto> cancelBooking(Principal principal, @PathVariable Long bookingId) {
        Long userId = Long.valueOf(principal.getName());
        Booking cancelledBooking = bookingService.cancelBooking(bookingId, userId);
        return new ResponseEntity<>(convertToDto(cancelledBooking), HttpStatus.OK);
    }

    private FitnessClassDto convertToDto(FitnessClass fitnessClass) {
        return FitnessClassDto.builder()
                .id(fitnessClass.getId())
                .name(fitnessClass.getName())
                .description(fitnessClass.getDescription())
                .startTime(fitnessClass.getScheduleTime())
                .instructor(fitnessClass.getInstructor())
                .maxCapacity(fitnessClass.getMaxCapacity())
                .currentBookedSlots(fitnessClass.getCurrentBookedSlots())
                .build();
    }

    private BookingDto convertToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .fitnessClassId(booking.getFitnessClass().getId())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .build();
    }
}