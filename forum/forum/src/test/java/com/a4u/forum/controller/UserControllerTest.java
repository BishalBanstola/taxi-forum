package com.a4u.forum.controller;

import com.a4u.forum.entity.AuthRequest;
import com.a4u.forum.entity.TokenRefreshRequest;
import com.a4u.forum.entity.UserInfo;
import com.a4u.forum.service.JwtService;
import com.a4u.forum.service.UserInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


public class UserControllerTest {
    private MockMvc mockMvc;

    @Mock
    private UserInfoService userInfoService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void testRegisterNewUser() throws Exception {
        UserInfo userInfo = new UserInfo();
        userInfo.setName("testUser");
        userInfo.setPassword("password");

        when(userInfoService.addUser(any(UserInfo.class)))
                .thenReturn(new ResponseEntity<>("User registered successfully", HttpStatus.OK));

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testUser\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));

        verify(userInfoService, times(1)).addUser(any(UserInfo.class));
    }

    @Test
    void testLoginUser() throws Exception {
        AuthRequest authRequest = new AuthRequest();
        authRequest.setUsername("testUser");
        authRequest.setPassword("testPassword");
        String token = "jwtToken";
        String refreshToken = "refreshToken";
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(jwtService.generateToken(authRequest.getUsername())).thenReturn(token);
        when(jwtService.generateRefreshToken(authRequest.getUsername())).thenReturn(refreshToken);

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testUser\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.username").value(authRequest.getUsername()))
                .andExpect(jsonPath("$.refreshToken").value(refreshToken));

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken(authRequest.getUsername());
        verify(jwtService, times(1)).generateRefreshToken(authRequest.getUsername());
    }

    @Test
    void testRefreshToken() throws Exception {
        TokenRefreshRequest request = new TokenRefreshRequest();
        request.setRefreshToken("validRefreshToken");
        String newAccessToken = "newJwtToken";
        String newRefreshToken = "newRefreshToken";
        String userName = "testUser";

        when(jwtService.validateAndGenerateNewToken(request.getRefreshToken())).thenReturn(newAccessToken);
        when(jwtService.validateAndGenerateNewRefreshToken(request.getRefreshToken())).thenReturn(newRefreshToken);
        when(jwtService.extractUsername(newAccessToken)).thenReturn(userName);

        mockMvc.perform(post("/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"validRefreshToken\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(newAccessToken))
                .andExpect(jsonPath("$.username").value(userName))
                .andExpect(jsonPath("$.refreshToken").value(newRefreshToken));

        verify(jwtService, times(1)).validateAndGenerateNewToken(request.getRefreshToken());
        verify(jwtService, times(1)).validateAndGenerateNewRefreshToken(request.getRefreshToken());
        verify(jwtService, times(1)).extractUsername(newAccessToken);
    }

    @Test
    void testWelcome() throws Exception {
        mockMvc.perform(get("/welcome"))
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome this endpoint is not secure"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void testUserProfile() throws Exception {
        mockMvc.perform(get("/user/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome to User Profile"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminProfile() throws Exception {
        mockMvc.perform(get("/admin/profile"))
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome to Admin Profile"));
    }
}
