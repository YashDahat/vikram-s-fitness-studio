package com.vikramsfitnessstudio.controller.admin;

import com.vikramsfitnessstudio.dto.BookingDto;
import com.vikramsfitnessstudio.model.Booking;
import com.vikramsfitnessstudio.service.BookingService;
import com.vikramsfitnessstudio.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/bookings")
public class AdminBookingController {

    private final BookingService bookingService;

    @Autowired
    public AdminBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingDto>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingDto> bookingDtos = bookings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(bookingDtos, HttpStatus.OK);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long bookingId) {
        // Assuming BookingService has a getBookingById method, if not,
        // it should be added or derived from getAllBookings and filtering.
        // For now, we'll implement it by finding in the list of all bookings.
        Booking booking = bookingService.getAllBookings().stream()
                .filter(b -> b.getId().equals(bookingId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        return new ResponseEntity<>(convertToDto(booking), HttpStatus.OK);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<BookingDto> cancelBooking(@PathVariable Long bookingId) {
        // Admin can cancel any booking, so userId is null for the check in service
        Booking cancelledBooking = bookingService.cancelBooking(bookingId, null);
        return new ResponseEntity<>(convertToDto(cancelledBooking), HttpStatus.OK);
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