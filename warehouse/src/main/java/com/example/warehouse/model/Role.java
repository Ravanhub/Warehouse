package com.example.warehouse.model;

public enum Role {
    ROLE_USER,
    ROLE_ADMIN;

    public static Role from(String value) {
        if (value == null || value.isBlank()) {
            return ROLE_USER;
        }

        String normalized = value.trim().toUpperCase();

        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }

        return Role.valueOf(normalized);
    }
}