package com.example.warehouse.controller;

import com.example.warehouse.auth.AuthRequest;
import com.example.warehouse.auth.AuthResponse;
import com.example.warehouse.dto.ApiResponse;
import com.example.warehouse.dto.RegisterRequest;
import com.example.warehouse.exception.BadRequestException;
import com.example.warehouse.model.RefreshToken;
import com.example.warehouse.model.Role;
import com.example.warehouse.model.User;
import com.example.warehouse.repository.UserRepository;
import com.example.warehouse.security.JwtService;
import com.example.warehouse.security.PasswordResetService;
import com.example.warehouse.security.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshService;
    private final PasswordResetService resetService;
    private final AuthenticationManager authenticationManager;

    public AuthController(
        UserRepository userRepo,
        PasswordEncoder encoder,
        JwtService jwtService,
        RefreshTokenService refreshService,
        PasswordResetService resetService,
        AuthenticationManager authenticationManager
    ) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.refreshService = refreshService;
        this.resetService = resetService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.findByUsername(req.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(resolveRole(req.getRole()));
        userRepo.save(user);

        return new ApiResponse<>(true, "Registered successfully", null);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getIdentifier(), req.getPassword())
        );

        User user = userRepo.findByUsernameOrEmail(req.getIdentifier(), req.getIdentifier())
            .orElseThrow(() -> new BadRequestException("User not found"));

        String access = jwtService.generateToken(user.getUsername(), user.getRole().name());
        String refresh = refreshService.create(user.getEmail()).getToken();
        AuthResponse response = new AuthResponse(access, refresh, user.getRole().name(), user.getUsername());

        return new ApiResponse<>(true, "Login successful", response);
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@RequestParam String token) {
        RefreshToken refreshToken = refreshService.verify(token);
        String newAccess = jwtService.generateToken(
            refreshToken.getUser().getUsername(),
            refreshToken.getUser().getRole().name()
        );

        AuthResponse response = new AuthResponse(
            newAccess,
            token,
            refreshToken.getUser().getRole().name(),
            refreshToken.getUser().getUsername()
        );

        return new ApiResponse<>(true, "Token refreshed", response);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgot(@RequestParam String email) {
        return new ApiResponse<>(true, "Reset token generated", resetService.create(email));
    }

    @PostMapping("/reset-password")
    public ApiResponse<String> reset(@RequestParam String token, @RequestParam String password) {
        resetService.reset(token, password);
        return new ApiResponse<>(true, "Password updated", null);
    }

    private Role resolveRole(String role) {
    	return Role.from(role);
    }
}
