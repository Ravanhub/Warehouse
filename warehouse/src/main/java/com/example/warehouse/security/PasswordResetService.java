package com.example.warehouse.security;

import com.example.warehouse.exception.BadRequestException;
import com.example.warehouse.model.PasswordResetToken;
import com.example.warehouse.model.User;
import com.example.warehouse.repository.PasswordResetRepository;
import com.example.warehouse.repository.UserRepository;
import java.time.Instant;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {

    private final PasswordResetRepository repo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public PasswordResetService(PasswordResetRepository repo, UserRepository userRepo, PasswordEncoder encoder) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public String create(String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("User not found"));

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusSeconds(600));
        repo.save(token);
        return token.getToken();
    }

    public void reset(String token, String password) {
        PasswordResetToken resetToken = repo.findByToken(token)
            .orElseThrow(() -> new BadRequestException("Reset token not found"));

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Reset token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(encoder.encode(password));
        userRepo.save(user);
    }
}