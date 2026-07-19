package com.vikramsfitnessstudio.config;

import com.vikramsfitnessstudio.model.Role;
import com.vikramsfitnessstudio.model.User;
import com.vikramsfitnessstudio.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User adminUser = new User(
                    "admin",
                    passwordEncoder.encode("adminpass"),
                    "admin@example.com",
                    Set.of(Role.ADMIN, Role.MEMBER)
            );
            userRepository.save(adminUser);
        }

        if (userRepository.findByUsername("member").isEmpty()) {
            User memberUser = new User(
                    "member",
                    passwordEncoder.encode("memberpass"),
                    "member@example.com",
                    Set.of(Role.MEMBER)
            );
            userRepository.save(memberUser);
        }
    }
}