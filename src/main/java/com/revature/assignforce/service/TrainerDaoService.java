package com.revature.assignforce.service;

import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dao.TrainerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class TrainerDaoService extends ActivatableObjectDaoService<Trainer, Integer>{
	
	public Trainer findByFirstName(String name){
		return ((TrainerRepository) repo).findByFirstName(name);
	}
}
