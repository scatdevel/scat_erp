package com.scat.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scat.dto.UserDTO;
import com.scat.model.request.UserDetailsRequestModel;
import com.scat.model.response.UserRest;
import com.scat.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDetailsRequestModel userDetails) {
        UserDTO userDto = new UserDTO();
        userDto.setUsername(userDetails.getUsername());
        userDto.setEmail(userDetails.getEmail());
        userDto.setPassword(userDetails.getPassword());

        UserDTO createdUser = userService.createUser(userDto);

        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    

        @GetMapping("/get")
        public ResponseEntity<List<UserRest>> getAllUsers() {
            List<UserDTO> users = userService.getAllUsers();
            List<UserRest> userRestList = users.stream()
                    .map(userDTO -> {
                        UserRest userRest = new UserRest();
                        BeanUtils.copyProperties(userDTO, userRest);
                        return userRest;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(userRestList);
        }
    

    @GetMapping("/{email}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String email) {
        UserDTO userDto = userService.getUser(email);
        if (userDto != null) {
            return ResponseEntity.ok(userDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
