package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dto.TrainerDTO;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.utils.JsonMaker;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;


import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
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
    private TrainerCtrl trainerController;

    @MockBean
    ActivatableObjectDaoService<Trainer, Integer> trainerService;

    private Trainer testTrainer = null;

    private JsonMaker jsonMaker = new JsonMaker();
    /*
    * sets up the above objects with their default values,
    * changes in the trainerDTO need to be made in the
    * test trainer as well
    */
    @Before
    public void setUp(){
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
        testTrainer = null;
    }

    // tests happy path
    @Test
    @WithMockUser(roles="ADMIN")
    public void createTrainer() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(testTrainer);
        mvc.perform(post("/api/v2/trainer")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testTrainer)))
                .andExpect(status().isOk());
    }

    //tests trainer creation using a trainerDTO that contains uninitialized values
    @Test
    @WithMockUser(roles="ADMIN")
    public void createTrainerWithEmptyDTOTest() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        testTrainer = new Trainer();
        mvc.perform(post("/api/v2/trainer")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(testTrainer)))
                .andExpect(status().isInternalServerError());
    }

    //tests trainer creation call where no DTO is passed in
    @Test
    @WithMockUser(roles="ADMIN")
    public void createTrainerWithNullDTOTest() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        mvc.perform(post("/api/v2/trainer")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void retrieveTrainerTest() throws Exception{
        given(trainerService.getOneItem(any(Integer.class))).willReturn(testTrainer);
        mvc.perform(get("/api/v2/trainer/42")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is(testTrainer.getFirstName())))
                .andExpect(jsonPath("$.lastName", is(testTrainer.getLastName())))
                .andExpect(jsonPath("$.certifications", is(testTrainer.getCertifications())));
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void retrieveTrainerWithBadIdTest() throws Exception{
        given(trainerService.getOneItem(any(Integer.class))).willReturn(null);
        mvc.perform(get("/api/v2/trainer/42")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void updateTrainerTest() throws Exception{
        given(trainerService.saveItem(any(Trainer.class))).willReturn(testTrainer);
        mvc.perform(put("/api/v2/trainer")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testTrainer)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void updateTrainerWithEmptyDTOTest() throws Exception{
        testTrainer = new Trainer();
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        mvc.perform(put("/api/v2/trainer")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testTrainer)))
                .andExpect(status().isNotModified());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void updateTrainerWithNullDTOTest() throws Exception{
        testTrainer = new Trainer();
        given(trainerService.saveItem(any(Trainer.class))).willReturn(null);
        mvc.perform(put("/api/v2/trainer")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void deleteTrainerTest() throws Exception{
        doNothing().when(trainerService).deleteItem(any(Integer.class));
        mvc.perform(delete("/api/v2/trainer/42")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void retrieveAllTrainersTest() throws Exception{
        List<Trainer> trainers = new ArrayList<Trainer>();
        trainers.add(testTrainer);
        given(trainerService.getAllItems()).willReturn(trainers);
        mvc.perform(get("/api/v2/trainer")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void retrieveAllTrainersReturnEmptyListTest() throws Exception{
        List<Trainer> trainers = new ArrayList<Trainer>();
        given(trainerService.getAllItems()).willReturn(trainers);
        mvc.perform(get("/api/v2/trainer")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles="ADMIN")
    public void retrieveAllTrainersReturnNullTest() throws Exception{
        given(trainerService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/trainer")
                    .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }
}