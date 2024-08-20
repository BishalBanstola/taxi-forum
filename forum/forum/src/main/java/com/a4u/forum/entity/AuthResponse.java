package com.a4u.forum.entity;

public class AuthResponse {
    private String token;
    private String username;
    private String refreshToken;

    // Constructor, getters, and setters

    public AuthResponse(String token, String username, String refreshToken) {
        this.token = token;
        this.username = username;
        this.refreshToken=refreshToken;
    }

    // Getters and Setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}