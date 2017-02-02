package com.revature.assignforce.domain.dao;

import org.springframework.stereotype.Repository;

import com.revature.assignforce.domain.Building;

@Repository
public interface BuildingRepository extends ActivatableObjectRepository<Building, Integer> {

}
