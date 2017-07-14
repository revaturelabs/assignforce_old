package com.revature.assignforce.domain.dao;

import org.springframework.stereotype.Repository;

import com.revature.assignforce.domain.Skill;

@Repository
public interface SkillRepository extends ActivatableObjectRepository<Skill, Integer> {

}
