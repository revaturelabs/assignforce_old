package com.revature.assignforce.web;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dto.TrainerDTO;
import com.revature.assignforce.object.comparators.TrainerComparator;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.xml.ws.Response;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by gdittric on 7/11/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
@Transactional
public class TrainerCtrlTest {
    TrainerDTO trainerDTO;

    @Autowired
    TrainerCtrl trainerController = null;

    Trainer testTrainer = null;

    TrainerComparator aTrainerComparator = null;
    /*
    * sets up the above object with their default values,
    * changes in the trainerDTO need to be made in the
    * test trainer as well
    */
    @Before
    public void setUp(){
        aTrainerComparator = new TrainerComparator();
        trainerDTO = new TrainerDTO();
        trainerDTO.setTrainerId(1);
        trainerDTO.setFirstName("Andy");
        trainerDTO.setLastName("Tang");
        List<Skill> skills = new ArrayList<Skill>();
        Skill aSkill = new Skill();
        aSkill.setName("mySkill");
        aSkill.setSkillId(1);
        aSkill.setActive(true);
        skills.add(aSkill);
        skills.add(aSkill);
        skills.add(aSkill);
        trainerDTO.setSkills(skills);
        trainerDTO.setCertifications(new ArrayList<>());
        trainerDTO.setUnavailabilities(new ArrayList<>());
        trainerDTO.setActive(true);
        trainerDTO.setResume("this is not a filepath");
        testTrainer = new Trainer( trainerDTO.getTrainerId(), trainerDTO.getFirstName(),
                trainerDTO.getLastName(), trainerDTO.getResume(),
                trainerDTO.getUnavailabilities(), trainerDTO.getSkills(),
                trainerDTO.getCertifications());
    }

    @After
    public void tearDown() throws Exception {
        trainerDTO = null;
        aTrainerComparator = null;
        testTrainer = null;
    }

    @Test
    public void createTrainer() throws Exception {
        Object anObject = null;
        try {
            anObject = trainerController.createTrainer(trainerDTO);
        }catch(NullPointerException ex){
            fail("null pointer exception occurred");
            ex.printStackTrace();
        }
        if(!(anObject instanceof ResponseEntity)){
            fail("TrainerCtrl did not return a response entity");
            return;
        }
        ResponseEntity<Trainer> response = (ResponseEntity<Trainer>) anObject;
        assertTrue(response.getStatusCode().equals(HttpStatus.OK));
        assertTrue(aTrainerComparator.compare(response.getBody(), testTrainer) == 0);
    }

    @Test
    public void createTrainerWithNullDTO(){
        Object anObject = null;
        try {
            anObject = trainerController.createTrainer(null);
        }catch(NullPointerException ex){
            fail("null pointer exception occurred");
            ex.printStackTrace();
        }
        if(!(anObject instanceof ResponseEntity)){
            fail("TrainerCtrl did not return a response entity");
            return;
        }
        assertTrue(((ResponseEntity<Trainer>) anObject).getStatusCode().equals(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @Test
    public void retrieveTrainer() throws Exception {
    }

    @Test
    public void retrieveTrainerWithNullDTO() throws Exception {
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