package com.scat.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.scat.dto.UserDTO;
import com.scat.exception.UserServiceException;
import com.scat.model.request.UserDetailsRequestModel;
import com.scat.model.response.Api_Response;
import com.scat.model.response.OperationStatusModel;
import com.scat.model.ui.UserRest;
import com.scat.service.UserService;
import com.scat.utils.ErrorMessages;
import com.scat.utils.RequestOperationName;
import com.scat.utils.RequestOperationResult;


@RestController
@RequestMapping("users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	@Autowired
	private UserService userService;

	
	@PostMapping(path = "/register", consumes = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE }, produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE })
	public UserRest createUser(@RequestBody UserDetailsRequestModel userDetails) throws Exception {
		if (userDetails.getEmail().isEmpty()) {
			throw new UserServiceException(ErrorMessages.MISSING_REQUIRED_FIELDS.getErrorMessage());
		}

		UserRest userRest = new UserRest();

		UserDTO userDTO = new UserDTO();
		BeanUtils.copyProperties(userDetails, userDTO);

		UserDTO createdUserDTO = userService.createUser(userDTO);
		BeanUtils.copyProperties(createdUserDTO, userRest);
		return userRest;
	}
	
	
	  
	
	

	@GetMapping(path = "/{id}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public UserRest getUser(@PathVariable("id") String email) {
		UserRest userRest = new UserRest();
		UserDTO userDTO = userService.getUserByEmail(email);
		BeanUtils.copyProperties(userDTO, userRest);
		return userRest;
	}

	@PutMapping(path = "/{id}", consumes = { MediaType.APPLICATION_JSON_VALUE }, produces = {
			MediaType.APPLICATION_JSON_VALUE })
	public UserRest updateUser(@PathVariable("id") String email, @RequestBody UserDetailsRequestModel userDetails)
			throws Exception {
		if (userDetails.getEmail().isEmpty()) {
			throw new UserServiceException(ErrorMessages.MISSING_REQUIRED_FIELDS.getErrorMessage());
		}

		UserRest userRest = new UserRest();

		UserDTO userDTO = new UserDTO();
		BeanUtils.copyProperties(userDetails, userDTO);

		UserDTO updatedUserDTO = userService.updateUser(email, userDTO);
		BeanUtils.copyProperties(updatedUserDTO, userRest);
		return userRest;
	}

	@DeleteMapping(path = "/{id}")
	public OperationStatusModel deleteUser(@PathVariable("id") String email) {
		OperationStatusModel operationStatusModel = new OperationStatusModel();
		operationStatusModel.setOperationName(RequestOperationName.DELETE.name());

		userService.deleteUser(email);

		operationStatusModel.setOperationResult(RequestOperationResult.SUCCESS.name());
		return operationStatusModel;
	}

	@GetMapping(produces = { MediaType.APPLICATION_JSON_VALUE })
	public List<UserRest> getUsers(@RequestParam(value = "page", defaultValue = "0") int page,
			@RequestParam(value = "limit", defaultValue = "3") int limit) {
		List<UserRest> userRestList = new ArrayList<UserRest>();

		List<UserDTO> userDTOList = userService.getUsers(page, limit);

		for (UserDTO userDTO : userDTOList) {
			UserRest userRest = new UserRest();
			BeanUtils.copyProperties(userDTO, userRest);
			userRestList.add(userRest);
		}

		return userRestList;
	}
	
	 @GetMapping("/users/location")
	    public Map<String, String> getLocationByPincode(@RequestParam String pincode) {
	        String url = "https://api.postalpincode.in/pincode/" + pincode;
	        RestTemplate restTemplate = new RestTemplate();
	        Map<String, String> response = new HashMap<>();
	        try {
	            Api_Response[] apiResponse = restTemplate.getForObject(url,Api_Response[].class);
	            if (apiResponse != null && apiResponse.length > 0) {
	                Api_Response responseData = apiResponse[0];
	                if ("Success".equals(responseData.getStatus())) {
	                    Api_Response.PostOffice postOffice = responseData.getPostOffices().get(0);
	                    response.put("village", postOffice.getName());
	                    response.put("taluk", postOffice.getTaluk());
	                    response.put("district", postOffice.getDistrict());
	                }
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	            response.put("error", "Unable to fetch location details");
	        }
	        return response;
	    }

	
	}


