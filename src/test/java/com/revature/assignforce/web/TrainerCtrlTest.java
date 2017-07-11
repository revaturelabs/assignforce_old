package com.revature.assignforce.web;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dto.TrainerDTO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by workm on 7/11/2017.
 */
public class TrainerCtrlTest {
    TrainerDTO trainerDTO = null;
    TrainerCtrl trainerController = null;

    @Before
    public void setUp(){
        trainerController = new TrainerCtrl();
        trainerDTO.setTrainerId(0);
        trainerDTO.setFirstName("Andy");
        trainerDTO.setLastName("Tang");
        List<Skill> skills = new ArrayList<Skill>();
        Skill aSkill = new Skill();
        aSkill.setName("mySkill");
        aSkill.setSkillId(0);
        aSkill.setActive(true);
        skills.add(aSkill);
        skills.add(aSkill);
        skills.add(aSkill);
        trainerDTO.setSkills(skills);
        trainerDTO.setCertifications(null);
        trainerDTO.setUnavailabilities(null);
        trainerDTO.setActive(true);
        trainerDTO.setResume("this is not a filepath");
    }

    @After
    public void tearDown() throws Exception {
        trainerDTO = null;
        trainerController = null;
    }

    @Test
    public void createTrainer() throws Exception {
        Object anObject = trainerController.createTrainer(trainerDTO);
        if(!(anObject instanceof ResponseEntity)){
            fail("TrainerCtrl did not return a response entity");
            return;
        }
        ResponseEntity<Trainer> response = (ResponseEntity<Trainer>) anObject;
        assertTrue(response.getStatusCode() == HttpStatus.OK);
        assertTrue(response.getBody().equals())
    }

    @Test
    public void createTrainerWithNullDTO() throws Exception {
    }

    @Test
    public void retrieveTrainer() throws Exception {
    }

    @Test
    public void retrieveTrainer() throws Exception {
    }

    @Test
    public void updateTrainer() throws Exception {
    }

    @Test
    public void deleteTrainer() throws Exception {
    }

    @Test
    public void retrieveAllTrainers() throws Exception {
    }

}