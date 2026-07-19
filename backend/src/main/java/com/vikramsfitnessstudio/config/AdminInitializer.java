package com.vikramsfitnessstudio.config;

import com.vikramsfitnessstudio.model.Role;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("adminpass"));
            adminUser.setEmail("admin@vikramsfitness.com");
            adminUser.setRoles(Set.of(Role.ADMIN));
            userRepository.save(adminUser);
            System.out.println("Default admin user created.");
        }
    }
}