package com.revature.assignforce.web;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.revature.assignforce.domain.Batch;
import com.revature.assignforce.domain.BatchStatusLookup;
import com.revature.assignforce.domain.Curriculum;
import com.revature.assignforce.domain.Location;
import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Trainer;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.DaoService;

@RestController
@RequestMapping("/api/v2/batch")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class BatchCtrl {

	@Autowired
	DaoService<Batch, Integer> batchService;
	
	@Autowired
	DaoService<Curriculum, Integer> currService;
	
	@Autowired
	DaoService<Location, Integer> locationService;
	
	@Autowired
	DaoService<Room, Integer> roomService;
	
	@Autowired
	DaoService<Trainer, Integer> trainerService;
	
	  // CREATE
		// creating new batch object from information passed from batch data transfer object
	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createBatch( @RequestBody BatchDTO in ) {
		
		int ID = in.getID();
		String name = in.getName();
		Curriculum curriculum = currService.getOneItem(in.getCurriculum());
		Location location = locationService.getOneItem(in.getLocation());
		Room room = roomService.getOneItem(in.getRoom());
		Trainer trainer = trainerService.getOneItem(in.getTrainer());
		Trainer cotrainer = trainerService.getOneItem(in.getCotrainer());
		Timestamp startDate = in.getStartDate();
		Timestamp endDate = in.getEndDate();
		BatchStatusLookup status = new BatchStatusLookup(1, "Scheduled");
		
		Batch out = new Batch( ID, name, curriculum, location, room, trainer, cotrainer, startDate, endDate, status );
		out = batchService.saveItem( out );

		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Batch failed to save."), HttpStatus.NOT_IMPLEMENTED);
		} else {
			return new ResponseEntity<Batch>(out, HttpStatus.OK);
		}
	}
	
	  // RETRIEVE
		// retrieve batch with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveBatch( @PathVariable("id") Integer ID ) {
		
		Batch out = batchService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No batch found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Batch>(out, HttpStatus.OK);
		}
	}
	
	  // UPDATE
		// updating an existing batch object with information passed from batch data transfer object
/*	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateBatch( @RequestBody BatchDTO in ) {
	
		int ID = in.getBatchId();
		String name = in.getName();
		Curriculum curriculum = currService.getOneItem(in.getCurriculum());
		Location location = locationService.getOneItem(in.getLocation());
		Room room = roomService.getOneItem(in.getRoom());
		Trainer trainer = trainerService.getOneItem(in.getTrainer());
		Trainer cotrainer = trainerService.getOneItem(in.getCotrainer());
		Timestamp startDate = in.getStartDate();
		Timestamp endDate = in.getEndDate();
		BatchStatusLookup status = new BatchStatusLookup(1, "Scheduled");
		
		Batch out = new Batch( ID, name, curriculum, location, room, trainer, cotrainer, startDate, endDate, status );
		out = batchService.saveItem( out );
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Batch failed to update."), HttpStatus.NOT_MODIFIED);
		} else {
			return new ResponseEntity<Batch>(out, HttpStatus.OK);
		}
	}*/
	
	  // DELETE
		// delete batch with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteBatch( @PathVariable("id") int ID ) {
		
		batchService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all batches
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveAllBatches() {
		
		List<Batch> all = batchService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all batches failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty() == true) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No batches available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Batch> >(all, HttpStatus.OK);
		}
	}
	
}
