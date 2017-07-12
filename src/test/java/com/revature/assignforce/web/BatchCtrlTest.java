package com.revature.assignforce.web;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.dto.BatchDTO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by roger on 7/11/2017.
 */
public class BatchCtrlTest {

    BatchDTO batchDTO = null;

    @Before
    public void setUp() {
        batchDTO.setID(0);
        batchDTO.setName("Gereth");
        batchDTO.setCurriculum(0);
        batchDTO.setFocus(0);
        batchDTO.setTrainer(0);
        batchDTO.setCotrainer(0);
        batchDTO.setLocation(0);
        batchDTO.setRoom(0);
        batchDTO.setStartDate(new Timestamp(0));
        batchDTO.setEndDate(new Timestamp(0));

        List<Skill> skills = new ArrayList<>();
        Skill aSkill = new Skill();
        aSkill.setName("diving");
        aSkill.setSkillId(0);
        aSkill.setActive(true);
        skills.add(aSkill);
        skills.add(aSkill);
        skills.add(aSkill);
        batchDTO.setSkills(skills);

        batchDTO.setBuilding(0);
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void createBatch() throws Exception {
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