package com.scat.dto;

import java.io.Serializable;

import javax.persistence.Column;

public class UserDTO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private long id;
	
	private String username;
	
	@Column(unique = true)
	private String email;

	private String password;
	
	private String encryptedPassword;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEncryptedPassword() {
		return encryptedPassword;
	}

	public void setEncryptedPassword(String encryptedPassword) {
		this.encryptedPassword = encryptedPassword;
	}

	
}
