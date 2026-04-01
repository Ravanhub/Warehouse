package com.example.warehouse.security;

import com.example.warehouse.exception.BadRequestException;
import com.example.warehouse.model.RefreshToken;
import com.example.warehouse.model.User;
import com.example.warehouse.repository.RefreshTokenRepository;
import com.example.warehouse.repository.UserRepository;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final UserRepository userRepo;

    public RefreshTokenService(RefreshTokenRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public RefreshToken create(String email) {
        User user = userRepo.findByEmail(email)
            .orElseThrow(() -> new BadRequestException("User not found"));

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusSeconds(86400));
        return repo.save(token);
    }

    public RefreshToken verify(String token) {
        RefreshToken refreshToken = repo.findByToken(token)
            .orElseThrow(() -> new BadRequestException("Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token expired");
        }

        return refreshToken;
    }
}