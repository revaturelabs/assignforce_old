package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dao.TrainerRepository;

import java.util.List;

@Transactional
@Service
public class TrainerDaoService extends ActivatableObjectDaoService<Trainer, Integer>{
	
	public Trainer findByFiristName(String name){
		return ((TrainerRepository) repo).findByFirstName(name);
	}
}
