package com.revature.assignforce.domain.dao;

import org.springframework.stereotype.Repository;

import com.revature.assignforce.domain.Trainer;

import java.util.List;

@Repository
public interface TrainerRepository extends ActivatableObjectRepository<Trainer, Integer> {
	Trainer findByFirstName(String name);
	List<Trainer> findByActiveIsTrue();
	//Trainer findById(Integer id);
}
