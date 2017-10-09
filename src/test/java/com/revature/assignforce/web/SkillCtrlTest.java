package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.security.CustomSecurity;
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

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by gdittric on 7/13/2017.
 */

@RunWith(SpringRunner.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = AssignForceV2Application.class)
@AutoConfigureMockMvc

public class SkillCtrlTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private ActivatableObjectDaoService<Skill, Integer> skillService;

    @MockBean
    CustomSecurity customSecurity;

    private Skill testSkill = null;

    private JsonMaker jsonMaker = new JsonMaker();

    @Before
    public void setUp(){
        testSkill = new Skill(0, "Sword Fighting");
        testSkill.setActive(true);
        given(customSecurity.hasPermission(any(),any(),any())).willReturn(true);
    }

    @After
    public void tearDown(){
        testSkill = null;
    }

    @Test
    @WithMockUser(roles = "admin")
    public void createSkill() throws Exception {
        given(skillService.saveItem(any(Skill.class))).willReturn(testSkill);
        mvc.perform(post("/api/v2/skill")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testSkill)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void createSkillWithEmptyDTO() throws Exception {
        testSkill = new Skill();
        given(skillService.saveItem(any(Skill.class))).willReturn(null);
        mvc.perform(post("/api/v2/skill")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testSkill)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveSkill() throws Exception {
        given(skillService.getOneItem(anyInt())).willReturn(testSkill);
        mvc.perform(get("/api/v2/skill/42")
                .with(csrf().asHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is(testSkill.getName())))
                .andExpect(jsonPath("$.skillId", is(testSkill.getSkillId())))
                .andExpect(jsonPath("$.active", is(testSkill.getActive())));
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveInvalidSkill() throws Exception {
        given(skillService.getOneItem(anyInt())).willReturn(null);
        mvc.perform(get("/api/v2/skill/42")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void updateSkill() throws Exception {
        given(skillService.saveItem(any(Skill.class))).willReturn(testSkill);
        mvc.perform(put("/api/v2/skill")
                .with(csrf().asHeader())
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonMaker.toJsonString(testSkill)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void updateEmptySkill() throws Exception {
        testSkill = new Skill();
        given(skillService.saveItem(any(Skill.class))).willReturn(null);
        mvc.perform(put("/api/v2/skill")
                .with(csrf().asHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMaker.toJsonString(testSkill)))
                .andExpect(status().isNotModified());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void deleteSkill() throws Exception {
        doNothing().when(skillService).deleteItem(anyInt());
        mvc.perform(delete("/api/v2/skill/42")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveAllSkills() throws Exception {
        List<Skill> listOSkills = new ArrayList<Skill>();
        List<String> listOJsonSkills = new ArrayList<String>();
        String jsonString = jsonMaker.toJsonString(testSkill);
        System.out.println(jsonString);
        listOJsonSkills.add(jsonString);
        listOSkills.add(testSkill);
        given(skillService.getAllItems()).willReturn(listOSkills);
        mvc.perform(get("/api/v2/skill")
                .with(csrf().asHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(listOSkills.size())));
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveAllSkillsWithNoSkills() throws Exception {
        List<Skill> listOSkills = new ArrayList<Skill>();
        given(skillService.getAllItems()).willReturn(listOSkills);
        mvc.perform(get("/api/v2/skill")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveAllSkillsWithError() throws Exception {
        given(skillService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/skill")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }
}