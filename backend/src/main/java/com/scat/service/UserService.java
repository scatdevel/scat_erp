package com.scat.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.scat.dto.UserDTO;

public interface UserService extends UserDetailsService {
    UserDTO createUser(UserDTO user);
    UserDTO getUser(String email);
    List<UserDTO> getAllUsers();
}
