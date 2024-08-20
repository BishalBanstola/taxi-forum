package com.a4u.forum.controller;

import com.a4u.forum.entity.AuthRequest;
import com.a4u.forum.entity.AuthResponse;
import com.a4u.forum.entity.TokenRefreshRequest;
import com.a4u.forum.entity.UserInfo;
import com.a4u.forum.service.JwtService;
import com.a4u.forum.service.UserInfoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
@CrossOrigin
@RestController
public class UserController {
    @Autowired
    private UserInfoService service;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome this endpoint is not secure";
    }

    @PostMapping("/register")
    public ResponseEntity<String> addNewUser(@RequestBody UserInfo userInfo) {
        return service.addUser(userInfo);
    }

    @GetMapping("/user/profile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public String userProfile() {
        return "Welcome to User Profile";
    }

    @GetMapping("/admin/profile")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String adminProfile() {
        return "Welcome to Admin Profile";
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        logger.debug("Received authentication request for username: {}", authRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(authRequest.getUsername());
                String refreshToken = jwtService.generateRefreshToken(authRequest.getUsername());
                logger.info("Authentication successful for username: {}", authRequest.getUsername());
                AuthResponse authResponse = new AuthResponse(token, authRequest.getUsername(),refreshToken);
                return ResponseEntity.ok(authResponse);
            } else {
                logger.warn("Authentication failed for username: {}", authRequest.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user credentials");
            }
        } catch (UsernameNotFoundException e) {
            logger.warn("UsernameNotFoundException during authentication for username: {}", authRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid user credentials");
        } catch (Exception e) {
            logger.error("Exception during authentication for username: {}", authRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication failed: " + e.getMessage());
        }
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        try {
            String newAccessToken = jwtService.validateAndGenerateNewToken(requestRefreshToken);
            String newRefreshToken=jwtService.validateAndGenerateNewRefreshToken(requestRefreshToken);
            String userName=jwtService.extractUsername(newAccessToken);
            return ResponseEntity.ok(new AuthResponse(newAccessToken, userName,newRefreshToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}
