package com.a4u.forum.service;

import com.a4u.forum.entity.UserInfo;
import com.a4u.forum.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserInfoService implements UserDetailsService {
    @Autowired
    private UserInfoRepository repository;
    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userDetail = repository.findByName(username);
        return userDetail.map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));
    }

    public ResponseEntity<String> addUser(UserInfo userInfo) {
        Optional<UserInfo> existingUserDetail = repository.findByName(userInfo.getName());
        if (existingUserDetail.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        if (repository.findByEmail(userInfo.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }
        // Ensure userInfo object is valid before saving
        if (userInfo.getName() == null || userInfo.getEmail() == null || userInfo.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user information");
        }
        if (userInfo.getRoles()==null){
            userInfo.setRoles("ROLE_USER");
        }

        userInfo.setPassword(encoder.encode(userInfo.getPassword()));
        UserInfo savedUser = repository.save(userInfo);
        int id = savedUser.getId();
        if (id > 0) {
            return ResponseEntity.ok("User Added Successfully with ID: " + id);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add user");
        }

    }


}
