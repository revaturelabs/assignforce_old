package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.*;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.security.CustomSecurity;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.service.BatchLocationDaoService;
import com.revature.assignforce.service.DaoService;
import com.revature.assignforce.service.TrainerDaoService;
import com.revature.assignforce.utils.JsonMaker;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by roger on 7/11/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc

public class BatchCtrlTest {

    private BatchDTO batchDTO = null;

    private JsonMaker jsonMaker = new JsonMaker();

    private BatchLocation batchLocation = null;

    private BatchStatusLookup batchStatusLookup = null;

    private Curriculum curriculum;

    private Curriculum focus;

    private Trainer aTrainer;

    private Trainer coTrainer;

    private Batch testBatch = null;

    private Timestamp sTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now().minusMonths(3)).getTime());

    private Timestamp eTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime());


    @Autowired
    private MockMvc mvc;

//    @MockBean
//    DaoService<Room, Integer> roomService;

    @MockBean
    DaoService<Unavailable, Integer> unavailableService;

    @MockBean
    DaoService<Batch, Integer> batchService;

    @MockBean
    ActivatableObjectDaoService<Curriculum, Integer> currService;

    @MockBean
    TrainerDaoService trainerService;

    @MockBean
    DaoService<BatchLocation, Integer> batchLocationService;

    @MockBean
    CustomSecurity customSecurity;

    @Before
    public void setUp() {
        List<Skill> skills = new ArrayList<Skill>();
        Skill aSkill = new Skill(0, "aSkill");
        skills.add(aSkill);
        List<Unavailable> unavailability = new ArrayList<Unavailable>();
        Unavailable anUnavailable = new Unavailable(0, new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime()), new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime()));
        unavailability.add(anUnavailable);
        List<Certification> certs = new ArrayList<Certification>();
        Certification aCert = new Certification();
        certs.add(aCert);
        aTrainer = new Trainer(0, "fname", "lname", "aResume", unavailability, skills, certs);
        coTrainer = new Trainer(2, "ffname", "dlname", "aResume2", unavailability, skills, certs);
        curriculum = new Curriculum(2, "myCurriculum", skills, false);
        batchStatusLookup = new BatchStatusLookup(0, "aStatus");
        batchLocation = new BatchLocation();
        batchLocation.setId(0);
        batchLocation.setLocationId(0);
        batchLocation.setLocationName("aLocation");
        batchLocation.setBuildingId(0);
        batchLocation.setRoomId(0);
        testBatch = new Batch(0, "new batch",
                new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime()),
                new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime()), curriculum,
                batchStatusLookup, aTrainer, coTrainer, skills,
                curriculum, batchLocation);
        batchDTO = new BatchDTO();
        batchDTO.setID(testBatch.getID());
        batchDTO.setName(testBatch.getName());
        batchDTO.setCurriculum(testBatch.getCurriculum().getCurrId());
        batchDTO.setFocus(testBatch.getFocus().getCurrId());
        batchDTO.setTrainer(testBatch.getTrainer().getTrainerId());
        batchDTO.setCotrainer(testBatch.getCotrainer().getTrainerId());
        batchDTO.setLocation(testBatch.getBatchLocation().getLocationId());
        batchDTO.setBuilding(testBatch.getBatchLocation().getBuildingId());
        batchDTO.setRoom(testBatch.getBatchLocation().getRoomId());
        batchDTO.setStartDate(testBatch.getStartDate());
        batchDTO.setEndDate(testBatch.getEndDate());
        batchDTO.setSkills(testBatch.getSkills());
        given(customSecurity.hasPermission(any(),any(),any())).willReturn(true);
    }

    @After
    public void tearDown() throws Exception {
        testBatch = null;
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void createBatch() throws Exception {
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(trainerService.getOneItem(anyInt())).willReturn(aTrainer);
        given(trainerService.getOneItem(anyInt())).willReturn(coTrainer);
        given(batchService.saveItem(any(Batch.class))).willReturn(testBatch);
        mvc.perform(post("/api/v2/batch")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(batchDTO)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id", is(testBatch.getID())));
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void createBatchWithEmptyDTO() throws Exception {
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(trainerService.getOneItem(anyInt())).willReturn(aTrainer);
        given(trainerService.getOneItem(anyInt())).willReturn(coTrainer);
        given(batchService.saveItem(any(Batch.class))).willReturn(null);
        mvc.perform(post("/api/v2/batch")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(batchDTO)))
                    .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void retrieveBatch() throws Exception {
        given(batchService.getOneItem(anyInt())).willReturn(testBatch);
        mvc.perform(get("/api/v2/batch/42")
                .with(csrf().asHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testBatch.getID())));
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void retrieveBatchWithEmptyDTO() throws Exception {
        given(batchService.getOneItem(anyInt())).willReturn(null);
        mvc.perform(get("/api/v2/batch/42")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void deleteBatch() throws Exception {
        Room aRoom = new Room();
        doNothing().when(batchService).deleteItem(anyInt());
        doNothing().when(unavailableService).deleteItem(anyInt());
        given(batchService.getOneItem(anyInt())).willReturn(testBatch);
//        given(roomService.getOneItem(anyInt())).willReturn(aRoom);
        mvc.perform(delete("/api/v2/batch/42")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void retrieveAllBatches() throws Exception {
        List<Batch> batches = new ArrayList<Batch>();
        batches.add(testBatch);
        given(batchService.getAllItems()).willReturn(batches);
        mvc.perform(get("/api/v2/batch")
                .with(csrf().asHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(batches.size())));
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void retrieveAllBatchesWithEmptySet() throws Exception {
        List<Batch> batches = new ArrayList<Batch>();
        given(batchService.getAllItems()).willReturn(batches);
        mvc.perform(get("/api/v2/batch")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void retrieveAllBatchesWithError() throws Exception {
        given(batchService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/batch")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void updateBatch() throws Exception {
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(trainerService.getOneItem(anyInt())).willReturn(aTrainer);
        given(trainerService.getOneItem(anyInt())).willReturn(coTrainer);
        given(batchService.saveItem(any(Batch.class))).willReturn(testBatch);
        given(batchService.getOneItem(anyInt())).willReturn(testBatch);
        mvc.perform(put("/api/v2/batch")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(batchDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testBatch.getID())));
    }

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void updateBatchWithEmptyDTO() throws Exception {
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(currService.getOneItem(anyInt())).willReturn(curriculum);
        given(trainerService.getOneItem(anyInt())).willReturn(aTrainer);
        given(trainerService.getOneItem(anyInt())).willReturn(coTrainer);
        given(batchService.saveItem(any(Batch.class))).willReturn(null);
        given(batchService.getOneItem(anyInt())).willReturn(testBatch);
        batchDTO = new BatchDTO();
        mvc.perform(put("/api/v2/batch")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

}