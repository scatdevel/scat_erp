package com.scat.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestParam;

import com.scat.dto.UserDTO;

public interface UserService extends UserDetailsService
{
	public UserDTO createUser(UserDTO userDTO);
	public UserDTO getUser(String email);
	public UserDTO updateUser(String userId,UserDTO userDTO);
	public void deleteUser(String userId);
	public List<UserDTO> getUsers(int page, int limit);
	UserDTO getUserByEmail(String userId);
	 public Map<String, String> getPincode(@RequestParam Long pincode);
	
}
