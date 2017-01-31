package com.revature.assignforce.web;

import java.util.List;

import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.TrainerDTO;
import com.revature.assignforce.service.DaoService;

@RestController
@RequestMapping("/api/v2/trainer")
public class TrainerCtrl {
	
	@Autowired
	ActivatableObjectDaoService<Trainer, Integer> trainerService;

	  // CREATE
		// creating new trainer object from information passed from trainer data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createTrainer( @RequestBody TrainerDTO in ) {
	
		int ID = in.getID(); 
		String firstName = in.getFirstName();
		String lastName = in.getLastName();
		List<Skill> skills = in.getSkills();
		List<Unavailable> unavailabilities = in.getUnavailabilities();
		
		Trainer out = new Trainer( ID, firstName, lastName, unavailabilities, skills );
		out = trainerService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Trainer failed to save."), HttpStatus.NOT_IMPLEMENTED);
		} else {
			return new ResponseEntity<Trainer>(out, HttpStatus.OK);
		}
	}
	
	  // RETRIEVE
		// retrieve trainer with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveTrainer( @PathVariable("id") int ID ) {
		
		Trainer out = trainerService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No trainer found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Trainer>(out, HttpStatus.OK);
		}
	}
	
	  // UPDATE
		// updating an existing trainer object with information passed from trainer data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateTrainer( @RequestBody TrainerDTO in ) {
	
		int ID = in.getID();
		String firstName = in.getFirstName();
		String lastName = in.getLastName();
		List<Skill> skills = in.getSkills();
		List<Unavailable> unavailabilities = in.getUnavailabilities();
		
		Trainer out = new Trainer( ID, firstName, lastName, unavailabilities, skills );
		out = trainerService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Trainer failed to update."), HttpStatus.NOT_MODIFIED);
		} else {
			return new ResponseEntity<Trainer>(out, HttpStatus.OK);
		}
	}
	
	  // DELETE
		// delete trainer with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteTrainer( @PathVariable("id") int ID ) {
		
		trainerService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all trainers
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveAllTrainers() {

		List<Trainer> all = trainerService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all trainers failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty() == true) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No trainers available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Trainer> >(all, HttpStatus.OK);
		}
	}
	
}
