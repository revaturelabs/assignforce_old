package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Location;

@Transactional
@Service
public class LocationDaoService extends ActivatableObjectDaoService<Location, Integer> {

}
