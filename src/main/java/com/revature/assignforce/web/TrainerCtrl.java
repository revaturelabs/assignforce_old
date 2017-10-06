package com.revature.assignforce.web;

import java.util.List;

import com.revature.assignforce.domain.Certification;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import com.revature.assignforce.service.TrainerDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.web.bind.annotation.*;

import com.revature.assignforce.domain.Skill;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.TrainerDTO;

@RestController
@RequestMapping("/api/v2/trainer")
//@EnableGlobalMethodSecurity(prePostEnabled = true)
//@EnableAspectJAutoProxy
public class TrainerCtrl {

	@Autowired
	TrainerDaoService trainerService;

	  // CREATE
		// creating new trainer object from information passed from trainer data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)

	public Object createTrainer( @RequestBody TrainerDTO in ) {

		int ID = in.getTrainerId();
		String firstName = in.getFirstName();
		String lastName = in.getLastName();
		String resume = in.getResume();
		List<Skill> skills = in.getSkills();
		List<Certification> certifications = in.getCertifications();
		List<Unavailable> unavailabilities = in.getUnavailabilities();

		Trainer out = new Trainer( ID, firstName, lastName, resume, unavailabilities, skills, certifications );
		out = trainerService.saveItem( out );

		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Trainer failed to save."), HttpStatus.INTERNAL_SERVER_ERROR);
		} else {
			return new ResponseEntity<Trainer>(out, HttpStatus.OK);
		}
	}

	  // RETRIEVE
		// retrieve trainer with given ID
	@PreAuthorize("hasPermission(#ID, 'Trainers')")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveTrainer( @PathVariable("id") int ID ) {

		Trainer out = trainerService.getOneItem(ID);

		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No trainer found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Trainer>(out, HttpStatus.OK);
		}
	}

	//RETRIEVE
	//retrieve trainer with given fistName, lastName
	@RequestMapping(value = "/{firstName}/{lastName}", method = RequestMethod.GET, produces =  MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveTrainer (@PathVariable("firstName") String fName, @PathVariable("lastName") String lname){
		Trainer out = trainerService.findByFirstNameAndLastName(fName, lname);

		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No trainer found of name " + fName +" " + lname + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Trainer>(out, HttpStatus.OK);
		}
	}

	  // UPDATE
		// updating an existing trainer object with information passed from trainer data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateTrainer( @RequestBody TrainerDTO in ) {
		int ID = in.getTrainerId();

		String firstName = in.getFirstName();
		String lastName = in.getLastName();
		String resume = in.getResume();
		List<Skill> skills = in.getSkills();
		List<Unavailable> unavailabilities = in.getUnavailabilities();
		List<Certification> certifications = in.getCertifications();

		Trainer out = new Trainer( ID, firstName, lastName, resume, unavailabilities, skills, certifications);
		out.setActive(in.getActive());
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
		} else if (all.isEmpty()) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No trainers available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Trainer> >(all, HttpStatus.OK);
		}
	}

}
