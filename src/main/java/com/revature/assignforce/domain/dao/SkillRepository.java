package com.revature.assignforce.domain.dao;

import com.revature.assignforce.domain.Skill;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends ActivatableObjectRepository<Skill, Integer> {

}
