package com.vikramsfitnessstudio.controller.admin;

import com.vikramsfitnessstudio.dto.FitnessClassDto;
import com.vikramsfitnessstudio.model.FitnessClass;
import com.vikramsfitnessstudio.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/classes")
public class AdminFitnessClassController {

    private final BookingService bookingService;

    @Autowired
    public AdminFitnessClassController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<FitnessClassDto>> getAllFitnessClasses() {
        List<FitnessClass> fitnessClasses = bookingService.getAllFitnessClasses();
        List<FitnessClassDto> fitnessClassDtos = fitnessClasses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(fitnessClassDtos, HttpStatus.OK);
    }

    @GetMapping("/{classId}")
    public ResponseEntity<FitnessClassDto> getFitnessClassById(@PathVariable Long classId) {
        FitnessClass fitnessClass = bookingService.getFitnessClassById(classId);
        return new ResponseEntity<>(convertToDto(fitnessClass), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<FitnessClassDto> createFitnessClass(@Valid @RequestBody FitnessClassDto fitnessClassDto) {
        FitnessClass newClass = convertToEntity(fitnessClassDto);
        FitnessClass createdClass = bookingService.createFitnessClass(newClass);
        return new ResponseEntity<>(convertToDto(createdClass), HttpStatus.CREATED);
    }

    @PutMapping("/{classId}")
    public ResponseEntity<FitnessClassDto> updateFitnessClass(@PathVariable Long classId, @Valid @RequestBody FitnessClassDto fitnessClassDto) {
        FitnessClass updatedClassEntity = convertToEntity(fitnessClassDto);
        FitnessClass resultClass = bookingService.updateFitnessClass(classId, updatedClassEntity);
        return new ResponseEntity<>(convertToDto(resultClass), HttpStatus.OK);
    }

    @DeleteMapping("/{classId}")
    public ResponseEntity<Void> deleteFitnessClass(@PathVariable Long classId) {
        bookingService.deleteFitnessClass(classId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private FitnessClassDto convertToDto(FitnessClass fitnessClass) {
        return FitnessClassDto.builder()
                .id(fitnessClass.getId())
                .name(fitnessClass.getName())
                .description(fitnessClass.getDescription())
                .startTime(fitnessClass.getScheduleTime()) // Assuming scheduleTime maps to startTime for DTO
                .endTime(fitnessClass.getScheduleTime().plusHours(1)) // Example: assuming 1 hour duration
                .instructor(fitnessClass.getInstructor())
                .maxCapacity(fitnessClass.getMaxCapacity())
                .currentBookedSlots(fitnessClass.getCurrentBookedSlots())
                .build();
    }

    private FitnessClass convertToEntity(FitnessClassDto fitnessClassDto) {
        FitnessClass fitnessClass = new FitnessClass();
        fitnessClass.setId(fitnessClassDto.getId());
        fitnessClass.setName(fitnessClassDto.getName());
        fitnessClass.setDescription(fitnessClassDto.getDescription());
        fitnessClass.setScheduleTime(fitnessClassDto.getStartTime()); // Assuming startTime maps to scheduleTime for Entity
        fitnessClass.setInstructor(fitnessClassDto.getInstructor());
        fitnessClass.setMaxCapacity(fitnessClassDto.getMaxCapacity());
        if (fitnessClassDto.getCurrentBookedSlots() != null) {
            fitnessClass.setCurrentBookedSlots(fitnessClassDto.getCurrentBookedSlots());
        }
        return fitnessClass;
    }
}