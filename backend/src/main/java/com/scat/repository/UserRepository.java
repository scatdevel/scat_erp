package com.scat.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.scat.entity.UserEntity;  

@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, Long>
{
	UserEntity findByEmail(String email);

}
