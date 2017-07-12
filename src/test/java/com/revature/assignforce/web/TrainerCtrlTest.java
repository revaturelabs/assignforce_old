package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.TrainerDTO;
import com.revature.assignforce.object.comparators.TrainerComparator;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;


import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by gdittric on 7/11/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc

public class TrainerCtrlTest {
    private TrainerDTO trainerDTO;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private TrainerCtrl trainerController = null;

    @MockBean
    ActivatableObjectDaoService<Trainer, Integer> trainerService;

    private Trainer testTrainer = null;

    private TrainerComparator aTrainerComparator = null;
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

    // tests happy path
    @Test
    public void createTrainer() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(testTrainer);
        mvc.perform(post("/api/v2/trainer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testTrainer.toJsonString()))
                .andExpect(status().isOk());
    }

    //tests trainer creation using a trainerDTO that contains uninitialized values
    @Test
    public void createTrainerWithEmptyDTO() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        testTrainer = new Trainer();
        mvc.perform(post("/api/v2/trainer")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(testTrainer.toJsonString()))
                .andExpect(status().isInternalServerError());
    }

    //tests trainer creation call where no DTO is passed in
    @Test
    public void createTrainerWithNullDTO() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        mvc.perform(post("/api/v2/trainer")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void retrieveTrainer() throws Exception{
        given(trainerService.getOneItem(any(Integer.class))).willReturn(testTrainer);
        mvc.perform(get("/api/v2/trainer/42")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is(testTrainer.getFirstName())))
                .andExpect(jsonPath("$.lastName", is(testTrainer.getLastName())))
                .andExpect(jsonPath("$.certifications", is(testTrainer.getCertifications())));
    }

    @Test
    public void retrieveTrainerWithBadId() throws Exception{
        given(trainerService.getOneItem(any(Integer.class))).willReturn(null);
        mvc.perform(get("/api/v2/trainer/42")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateTrainer() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(testTrainer);
        mvc.perform(put("/api/v2/trainer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testTrainer.toJsonString()))
                .andExpect(status().isOk());
    }

    @Test
    public void updateTrainerWithEmptyDTO() throws Exception{
        testTrainer = new Trainer();
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        mvc.perform(put("/api/v2/trainer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testTrainer.toJsonString()))
                .andExpect(status().isNotModified());
    }

    @Test
    public void updateTrainerWithNullDTO() throws Exception{
        testTrainer = new Trainer();
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        mvc.perform(put("/api/v2/trainer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteTrainer(){

    }

    @Test
    public void retrieveAllTrainers(){

    }

}