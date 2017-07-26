package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.Setting;
import com.revature.assignforce.service.DaoService;
import com.revature.assignforce.utils.JsonMaker;
import org.hamcrest.Matchers;
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

import static org.junit.Assert.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
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
public class SettingCtrlTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private DaoService<Setting, Integer> settingService;

    private Setting testSetting = null;

    private JsonMaker jsonMaker = new JsonMaker();

    @Before
    public void setUp(){
        testSetting = new Setting();
        testSetting.setSettingId(0);
        testSetting.setAlias("an Alias");
        testSetting.setTrainersPerPage(10);
        testSetting.setReportGrads(10);
    }

    @After
    public void tearDown(){
        testSetting = null;
    }

    @Test
    @WithMockUser(roles = "admin")
    public void createSettingTest() throws Exception {
        mvc.perform(post("/api/v2/setting")
                .with(csrf().asHeader())
        .contentType(MediaType.APPLICATION_JSON)
        .content(jsonMaker.toJsonString(testSetting)))
                .andExpect(status().isNotImplemented());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveSettingTest() throws Exception {
        given(settingService.getOneItem(anyInt())).willReturn(testSetting);
        mvc.perform(get("/api/v2/setting/42")
                .with(csrf().asHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.settingId",
                        Matchers.is(testSetting.getSettingId())))
                .andExpect(jsonPath("$.alias",
                        Matchers.is(testSetting.getAlias())));
    }

    @Test
    @WithMockUser(roles = "admin")
    public void retrieveInvalidSettingTest() throws Exception {
        given(settingService.getOneItem(anyInt())).willReturn(null);
        mvc.perform(get("/api/v2/setting/42")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void getGlobalSettingsTest() throws Exception {
        List<Setting> listOfSettings = new ArrayList<Setting>();
        listOfSettings.add(testSetting);
        given(settingService.getAllItems()).willReturn(listOfSettings);
        mvc.perform(get("/api/v2/setting")
                .with(csrf().asHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()",
                        Matchers.is(listOfSettings.size())));
    }

    @Test
    @WithMockUser(roles = "admin")
    public void getEmptyGlobalSettingsTest() throws Exception {
        List<Setting> listOfSettings = new ArrayList<Setting>();
        given(settingService.getAllItems()).willReturn(listOfSettings);
        mvc.perform(get("/api/v2/setting")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void getGlobalSettingsFailedTest() throws Exception {
        given(settingService.getAllItems()).willReturn(null);
        mvc.perform(get("/api/v2/setting")
                .with(csrf().asHeader()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "admin")
    public void updateSettingTest() throws Exception {
       given(settingService.saveItem(testSetting)).willReturn(testSetting);
       mvc.perform(put("/api/v2/setting")
               .with(csrf().asHeader())
            .contentType(MediaType.APPLICATION_JSON)
            .content(jsonMaker.toJsonString(testSetting)))
                .andExpect(status().isNoContent());
    }
//TODO: See August or Kevin
//    @Test
//    public void updateSettingFailedTest() throws Exception {
//        testSetting = new Setting();
//        given(settingService.saveItem(testSetting)).willThrow(new RuntimeException());
//        mvc.perform(put("/api/v2/setting")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(jsonMaker.toJsonString(testSetting)))
//                .andExpect(status().isInternalServerError());
//    }

    @Test
    @WithMockUser(roles = "admin")
    public void deleteSettingTest() throws Exception {
        mvc.perform(delete("/api/v2/setting/42")
                .with(csrf().asHeader()))
                .andExpect(status().isNotImplemented());
    }

}