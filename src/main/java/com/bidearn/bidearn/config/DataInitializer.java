package com.bidearn.bidearn.config;

import com.bidearn.bidearn.model.Role;
import com.bidearn.bidearn.model.User;
import com.bidearn.bidearn.model.UserStatus;
import com.bidearn.bidearn.repository.AuctionRepository;
import com.bidearn.bidearn.repository.ItemRepository;
import com.bidearn.bidearn.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final AuctionRepository auctionRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository, ItemRepository itemRepository, AuctionRepository auctionRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.auctionRepository = auctionRepository;
    }

    @Override
    public void run(String... args) {
        // Seed Default Admin User if not exists
        if (!userRepository.existsByEmailIgnoreCase("admin@bidearn.com")) {
            User admin = User.builder()
                    .fullName("admin")
                    .email("admin@bidearn.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .country("India")
                    .phoneNumber("+91 98765 43210")
                    .profilePhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80")
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
        }
    }
}
