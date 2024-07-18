package com.scat.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.scat.dto.UserDTO;
import com.scat.entity.UserEntity;
import com.scat.exception.UserServiceException;
import com.scat.repository.UserRepository;
import com.scat.service.UserService;
import com.scat.utils.ErrorMessages;
import com.scat.utils.Utils;

@Service
public class UserServiceImpl implements UserService
{

	@Autowired
	UserRepository userRepository;

	@Autowired
	Utils utils;

	@Autowired
	BCryptPasswordEncoder bcryptPasswordEncoder;

	@Override
	public UserDTO createUser(UserDTO userDTO)
	{
		UserEntity userEntityByEmail = userRepository.findByEmail(userDTO.getEmail());
		if (userEntityByEmail != null)
		{
			throw new RuntimeException("Record already exists");
		}

		UserEntity userEntity = new UserEntity();
		BeanUtils.copyProperties(userDTO, userEntity);
		
		String encryptedPassword= userDTO.getPassword();
	userEntity.setEncryptedPassword(bcryptPasswordEncoder.encode(encryptedPassword));

	

		
		
		UserEntity storedUserEntity = userRepository.save(userEntity);

		UserDTO returnUserDTO = new UserDTO();
		BeanUtils.copyProperties(storedUserEntity, returnUserDTO);

		return returnUserDTO;
	}

	@Override
	public UserDTO getUser(String email)
	{
		UserEntity userEntity = userRepository.findByEmail(email);
		if (userEntity == null)
		{
			throw new UsernameNotFoundException(email);
		}
		UserDTO returnUserDTO = new UserDTO();
		BeanUtils.copyProperties(userEntity, returnUserDTO);
		return returnUserDTO;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException
	{
		UserEntity userEntity = userRepository.findByEmail(email);
		if (userEntity == null)
		{
			throw new UsernameNotFoundException(email);
		}
		return new User(userEntity.getEmail(), userEntity.getEncryptedPassword(),
				new ArrayList<>());
	}

	@Override
	public UserDTO getUserByEmail(String email)
	{
		UserDTO returnUserDTO = new UserDTO();
		UserEntity userEntityByEmail = userRepository.findByEmail(email);

		if (userEntityByEmail == null)
		{
			throw new UsernameNotFoundException(email);
		}

		BeanUtils.copyProperties(userEntityByEmail, returnUserDTO);

		return returnUserDTO;
	}

	@Override
	public UserDTO updateUser(String user, UserDTO userDTO)
	{
		UserDTO returnUserDTO = new UserDTO();
		UserEntity userEntityByEmail = userRepository.findByEmail(user);

		if (userEntityByEmail == null)
		{
			throw new UserServiceException(ErrorMessages.RECORD_NOT_FOUND.getErrorMessage());
		}

		userEntityByEmail.setUsername(userDTO.getUsername());
		userEntityByEmail.setEmail(userDTO.getEmail());
		userEntityByEmail
				.setEncryptedPassword(bcryptPasswordEncoder.encode(userDTO.getPassword()));

		UserEntity updatedUserEntity = userRepository.save(userEntityByEmail);

		BeanUtils.copyProperties(updatedUserEntity, returnUserDTO);

		return returnUserDTO;
	}

	@Override
	public void deleteUser(String userId)
	{
		UserEntity userEntityByUserId = userRepository.findByEmail(userId);

		if (userEntityByUserId == null)
		{
			throw new UserServiceException(ErrorMessages.RECORD_NOT_FOUND.getErrorMessage());
		}
		userRepository.delete(userEntityByUserId);

	}

	@Override
	public List<UserDTO> getUsers(int page, int limit)
	{
		List<UserDTO> userDTOList = new ArrayList<UserDTO>();
		
		if(page>0)
		{
			page = page-1; 
		}
		
		Pageable pageable= PageRequest.of(page, limit);
		Page<UserEntity> usersPage = userRepository.findAll(pageable);
		
		List<UserEntity> userEntityList = usersPage.getContent();
		
		for (UserEntity userEntity : userEntityList)
		{
			UserDTO userDTO = new UserDTO();
			BeanUtils.copyProperties(userEntity, userDTO);
			userDTOList.add(userDTO);
		}
		
		return userDTOList;
	}

	@Override
	public Map<String, String> getPincode(Long pincode) {
		// TODO Auto-generated method stub
		return null;
	}

	
	}


