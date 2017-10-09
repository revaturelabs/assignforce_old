package com.revature.assignforce.web;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.dto.SkillDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Zach Nelson on 2/9/2017.
 */
@RestController
@RequestMapping("/api/v2/skill")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class SkillCtrl {

    @Autowired
    ActivatableObjectDaoService<Skill, Integer> skillService;

    // CREATE
    // creating new curriculum object from information passed from curriculum data transfer object
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object createSkill( @RequestBody SkillDTO in ) {

        int ID = in.getSkillId();
        String name = in.getName();

        Skill out = new Skill( ID, name );
        out = skillService.saveItem( out );

        if (out == null) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Skill failed to save."), HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            return new ResponseEntity<Skill>(out, HttpStatus.OK);
        }
    }

    // RETRIEVE
    // retrieve skill with given ID
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object retrieveSkill( @PathVariable("id") int ID ) {

        Skill out = skillService.getOneItem(ID);
        if (out == null) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No skill found of ID " + ID + "."), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<Skill>(out, HttpStatus.OK);
        }
    }

    // UPDATE
    // updating an existing skill object with information passed from skill data transfer object
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object updateSkill( @RequestBody SkillDTO in ) {

        int ID = in.getSkillId();
        String name = in.getName();

        Skill out = new Skill( ID, name );
        // may need to set outs active to true
        out = skillService.saveItem( out );

        if (out == null) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Skill failed to save."), HttpStatus.NOT_MODIFIED);
        } else {
            return new ResponseEntity<Skill>(out, HttpStatus.OK);
        }
    }

    // DELETE
    // delete skill with given ID
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object deleteSkill( @PathVariable("id") int ID ) {

        skillService.deleteItem(ID);
        return new ResponseEntity<Object>(null, HttpStatus.OK);
    }

    // GET ALL
    // retrieve all skills
    @PreAuthorize("hasPermission('', 'basic')")
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Object retrieveAllSkills() {

        List<Skill> all = skillService.getAllItems();
        if (all == null) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all skills failed."), HttpStatus.NOT_FOUND);
        } else if (all.isEmpty()) {
            return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No skills available."), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity< List<Skill> >(all, HttpStatus.OK);
        }
    }
}
