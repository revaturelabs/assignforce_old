package com.revature.assignforce.domain.dao;

import com.revature.assignforce.domain.Trainer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerRepository extends ActivatableObjectRepository<Trainer, Integer> {
	public Trainer findByFirstName(String name);
	public List<Trainer> findByActiveIsTrue();
}
