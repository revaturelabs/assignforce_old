package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Curriculum;

@Transactional
@Service
public class CurriculumDaoService extends ActivatableObjectDaoService<Curriculum, Integer> {

}
