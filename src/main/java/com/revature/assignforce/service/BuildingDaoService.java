package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Building;

@Transactional
@Service
public class BuildingDaoService extends ActivatableObjectDaoService<Building, Integer> {

}
