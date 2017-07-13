package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.*;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.service.DaoService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    private BatchDTO batchDTO;

    private BatchLocation batchLocation = new BatchLocation();

    private List<Skill> skills = new ArrayList<>();

    private List<Unavailable> unavailables = new ArrayList<>();

    private List<Certification> certifications = new ArrayList<>();

    private Batch batchTest = null;

    private Timestamp sTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now().minusMonths(3)).getTime());

    private Timestamp eTimestamp = new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime());

    @Autowired
    private MockMvc mvc;

    @MockBean
    DaoService<Batch, Integer> batchService;

    @MockBean
    ActivatableObjectDaoService<Curriculum, Integer> currService;

    @MockBean
    ActivatableObjectDaoService<Location, Integer> locationService;

    @MockBean
    ActivatableObjectDaoService<Room, Integer> roomService;

    @MockBean
    ActivatableObjectDaoService<Trainer, Integer> trainerService;

    @MockBean
    DaoService<BatchLocation, Integer> batchLocationService;

    @MockBean
    DaoService<Unavailable, Integer> unavailableService;

    @Before
    public void setUp() {

        Curriculum curriculum = new Curriculum(1, "Test", skills);
        Curriculum focus = new Curriculum(2,"Test", skills);
        Trainer trainer = new Trainer(1, "Test", "Tester", "resume", unavailables, skills, certifications);
        Trainer cotrainer = new Trainer(2, "Test", "Tester", "resume", unavailables, skills, certifications);

        batchDTO = new BatchDTO();
        batchDTO.setID(1);
        batchDTO.setName("Roger");
//        batchDTO.setCurriculum(1);
//        batchDTO.setFocus(1);
//        batchDTO.setTrainer(1);
//        batchDTO.setCotrainer(1);
        batchDTO.setLocation(1);
        batchDTO.setRoom(1);
        batchDTO.setStartDate(sTimestamp);
        batchDTO.setEndDate(eTimestamp);

        Skill aSkill = new Skill();
        aSkill.setName("skill");
        aSkill.setSkillId(1);
        aSkill.setActive(true);
        skills.add(aSkill);
        batchDTO.setSkills(skills);

        Unavailable unavailable = new Unavailable();
        unavailable.setStartDate(sTimestamp);
        unavailable.setEndDate(eTimestamp);
        unavailables.add(unavailable);


        Certification certification = new Certification();
        certification.setId(1);
        certification.setFile("file");
        certification.setName("name");
        certification.setTrainer(1);
        certifications.add(certification);


        batchLocation.setId(1);
        batchLocation.setLocationId(1);
        batchLocation.setBuildingId(1);
        batchLocation.setRoomId(1);

        BatchStatusLookup bsl = new BatchStatusLookup(1, "Scheduled");

        batchTest = new Batch(batchDTO.getID(), batchDTO.getName(), batchDTO.getStartDate(), batchDTO.getEndDate(),
                curriculum, bsl, trainer, cotrainer, batchDTO.getSkills(),
                focus, batchLocation);
    }

    @After
    public void tearDown() throws Exception {
        batchDTO = null;
        batchTest = null;
    }

    @Test
    public void createBatch() throws Exception {

        Curriculum curriculum = new Curriculum(1, "Test", skills);
        Curriculum focus = new Curriculum(2,"Test", skills);
        Trainer trainer = new Trainer(1, "Test", "Tester", "resume", unavailables, skills, certifications);
        Trainer cotrainer = new Trainer(2, "Test", "Tester", "resume", unavailables, skills, certifications);


        given(currService.getOneItem(batchDTO.getCurriculum())).willReturn(curriculum);
        given(currService.getOneItem(batchDTO.getFocus())).willReturn(focus);
        given(trainerService.getOneItem(batchDTO.getTrainer())).willReturn(trainer);
        given(trainerService.getOneItem(batchDTO.getCotrainer())).willReturn(cotrainer);
        given(batchLocationService.saveItem(batchLocation)).willReturn(batchLocation);

        curriculum = currService.getOneItem(batchDTO.getCurriculum());
        focus = currService.getOneItem(batchDTO.getFocus());
        trainer = trainerService.getOneItem(batchDTO.getTrainer());
        cotrainer = trainerService.getOneItem(batchDTO.getCotrainer());

//        mvc.perform(post("/api/v2/batch")
//                .contentType(MediaType.APPLICATION_JSON_VALUE)
//                .content(batchTest.toJsonString()))
//                .andExpect(status().isOk());
    }

    @Test
    public void createBatchWithNullDTO() throws Exception {
    }

    @Test
    public void retrieveBatch() throws Exception {
    }

    @Test
    public void retrieveBatchWithNullDTO() throws Exception {
    }

    @Test
    public void deleteBatch() throws Exception {
    }

    @Test
    public void deleteBatchWithNullDTO() throws Exception {
    }

    @Test
    public void retrieveAllBatches() throws Exception {
    }

    @Test
    public void retrieveAllBatchesWithNullDTO() throws Exception {
    }

    @Test
    public void updateBatch() throws Exception {
    }

    @Test
    public void updateBatchWithNullDTO() throws Exception {
    }

}