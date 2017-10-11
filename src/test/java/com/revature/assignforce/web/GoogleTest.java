package com.revature.assignforce.web;

import com.revature.assignforce.AssignForceV2Application;
import com.revature.assignforce.domain.*;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.security.CustomSecurity;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.service.DaoService;
import com.revature.assignforce.service.TrainerDaoService;
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

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

public class GoogleTest {
    @Autowired
    private MockMvc mvc;

    @Before
    public void setUp() {}

    @After
    public void tearDown() throws Exception {}

    @Test
    @WithMockUser(roles = "Her Majesty The Queen Of England")
    public void googleStatus() throws Exception {
        mvc.perform(put("/api/v2/google/googleStatus")
                .with(csrf().asHeader()))
                .andExpect(status().isOk());
    }

}
