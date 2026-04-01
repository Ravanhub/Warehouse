package com.example.warehouse.config;

import com.example.warehouse.model.Category;
import com.example.warehouse.model.Role;
import com.example.warehouse.model.User;
import com.example.warehouse.repository.CategoryRepository;
import com.example.warehouse.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
        UserRepository userRepository,
        CategoryRepository categoryRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@warehouse.com");
                admin.setPassword(passwordEncoder.encode("Admin123"));
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);

                User operator = new User();
                operator.setUsername("operator");
                operator.setEmail("user@warehouse.com");
                operator.setPassword(passwordEncoder.encode("User1234"));
                operator.setRole(Role.ROLE_USER);
                userRepository.save(operator);
            }

            if (categoryRepository.count() == 0) {
                categoryRepository.save(namedCategory("Electronics"));
                categoryRepository.save(namedCategory("Tools"));
                categoryRepository.save(namedCategory("Furniture"));
                categoryRepository.save(namedCategory("Office Supplies"));
                categoryRepository.save(namedCategory("Safety Gear"));
                categoryRepository.save(namedCategory("Raw Materials"));
                categoryRepository.save(namedCategory("Packaging"));
            }
        };
    }

    private static Category namedCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return category;
    }
}
