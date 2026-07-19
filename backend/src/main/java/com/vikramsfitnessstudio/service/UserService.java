package com.vikramsfitnessstudio.service;

import com.vikramsfitnessstudio.dto.AuthRequest;
import com.vikramsfitnessstudio.dto.AuthResponse;
import com.vikramsfitnessstudio.dto.RegisterRequest;
import com.vikramsfitnessstudio.model.Role;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.UserRepository;
import com.vikramsfitnessstudio.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        Set<Role> roles = new HashSet<>();
        roles.add(Role.USER); // Default role for new registrations

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getEmail(),
                roles
        );
        userRepository.save(user);

        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new HashSet<>()));
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                .build();
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String token = jwtUtil.generateToken(userDetails);
            return AuthResponse.builder()
                    .token(token)
                    .username(user.getUsername())
                    .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                    .build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid username or password", e);
        }
    }
}