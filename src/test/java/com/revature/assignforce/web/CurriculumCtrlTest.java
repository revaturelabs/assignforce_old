package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Curriculum;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.dto.CurriculumDTO;
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
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by roger on 7/13/2017.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc

public class CurriculumCtrlTest {

    private CurriculumDTO curriculumDTO;

    private Curriculum curriculumTest;

    private JsonMaker jsonMaker = new JsonMaker();

    @Autowired
    private MockMvc mvc;

    @MockBean
    ActivatableObjectDaoService<Curriculum, Integer> currService;

    @Before
    public void setUp() throws Exception {
        curriculumDTO = new CurriculumDTO();
        curriculumDTO.setCurrId(1);
        curriculumDTO.setName("Test");

        List<Skill> skills = new ArrayList<>();
        Skill aSkill = new Skill();
        aSkill.setName("skill");
        aSkill.setSkillId(1);
        aSkill.setActive(true);
        skills.add(aSkill);
        curriculumDTO.setSkills(skills);

        curriculumTest = new Curriculum(curriculumDTO.getCurrId(), curriculumDTO.getName(), curriculumDTO.getSkills());
    }

    @After
    public void tearDown() throws Exception {
        curriculumDTO = null;
        curriculumTest = null;
    }

    @Test
    public void createCurriculumTest() throws Exception {
        given(currService.saveItem(any(Curriculum.class))).willReturn(curriculumTest);
        mvc.perform(post("/api/v2/curriculum")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(curriculumTest)))
                .andExpect(status().isOk());
    }

    @Test
    public void createCurriculumWithEmptyDTOTest() throws Exception {
        given(currService.saveItem(any(Curriculum.class))).willReturn(null);
        mvc.perform(post("/api/v2/curriculum")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(curriculumTest)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    public void createCurriculumWithNullDTOTest() throws Exception {
        given(currService.saveItem(any(Curriculum.class))).willReturn(null);
        mvc.perform(post("/api/v2/curriculum")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void retrieveCurriculumTest() throws Exception {
        given(currService.getOneItem(any(Integer.class))).willReturn(curriculumTest);
        mvc.perform(get("/api/v2/curriculum/1")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(curriculumTest.getName())))
                .andExpect(jsonPath("$.currId", is(curriculumTest.getCurrId())))
                .andExpect(jsonPath("$.active", is(curriculumTest.getActive())));
    }

    @Test
    public void retrieveCurriculumWithBadIdTest() throws Exception {
        given(currService.getOneItem(any(Integer.class))).willReturn(null);
        mvc.perform(get("/api/v2/curriculum/1")
                .contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateCurriculumTest() throws Exception {
        given(currService.saveItem(any(Curriculum.class))).willReturn(curriculumTest);
        mvc.perform(put("/api/v2/curriculum")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(curriculumTest)))
                .andExpect(status().isOk());
    }

    @Test
    public void updateCurriculumWithEmptyDTOTest() throws Exception {
        curriculumTest = new Curriculum();
        given(currService.saveItem(any(Curriculum.class))).willReturn(null);
        mvc.perform(put("/api/v2/curriculum")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(jsonMaker.toJsonString(curriculumTest)))
                .andExpect(status().isNotModified());
    }

    @Test
    public void updateCurriculumWithNullDTOTest() throws Exception {
        curriculumTest = new Curriculum();
        given(currService.saveItem(any(Curriculum.class))).willReturn(null);
        mvc.perform(put("/api/v2/curriculum")
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteCurriculumTest() throws Exception {
        doNothing().when(currService).deleteItem(any(Integer.class));
        mvc.perform(delete("/api/v2/curriculum/1"))
                .andExpect(status().isOk());
    }

    @Test
    public void retrieveAllCurriculaTest() throws Exception {
        List<Curriculum> curricula = new ArrayList<>();
        curricula.add(curriculumTest);
        given(currService.getAllItems()).willReturn(curricula);
        mvc.perform(get("/api/v2/curriculum"))
                .andExpect(status().isOk());
    }

    @Test
    public void retrieveAllCurriculaWithEmptyListTest() throws Exception {
        List<Curriculum> curricula = new ArrayList<>();
        given(currService.getAllItems()).willReturn(curricula);
        mvc.perform(get("/api/v2/curriculum"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void retrieveAllCurriculaReturnNullTest() throws Exception {
        given(currService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/curriculum"))
                .andExpect(status().isNotFound());
    }
}