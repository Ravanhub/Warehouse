package com.example.warehouse.auth;

public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String role;
    private String username;

    public AuthResponse(String accessToken, String refreshToken, String role, String username) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.username = username;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getRole() {
        return role;
    }

    public String getUsername() {
        return username;
    }
}