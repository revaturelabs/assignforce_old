package com.revature.assignforce.service;

import com.revature.assignforce.domain.Skill;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Zach Nelson on 2/9/2017.
 */

@Transactional
@Service
public class SkillDaoService extends ActivatableObjectDaoService<Skill, Integer>{
}
