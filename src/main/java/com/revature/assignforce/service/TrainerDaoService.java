package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dao.TrainerRepository;

@Transactional
@Service
public class TrainerDaoService extends ActivatableObjectDaoService<Trainer, Integer>{
	
	public Trainer findByFirstName(String name){
		return ((TrainerRepository) repo).findByFirstName(name);
	}
	//public Trainer findById(Integer id) {return ((TrainerRepository) repo).findOne(id);}


	public Trainer getByFirstNameANDLastName(String fName, String lName){
		return ((TrainerRepository) repo).getByFirstNameAndLastName(fName, lName);
	}
}
