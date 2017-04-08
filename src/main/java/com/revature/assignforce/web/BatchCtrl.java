package com.revature.assignforce.web;

import java.sql.Timestamp;
import java.util.List;

import com.revature.assignforce.domain.*;
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

	@Autowired
	DaoService<BatchLocation, Integer> batchLocationService;
	
	  // CREATE
		// creating new batch object from information passed from batch data transfer object
	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createBatch( @RequestBody BatchDTO in ) {
		
		int ID = in.getID();
		String name = in.getName();
		Curriculum curriculum = currService.getOneItem(in.getCurriculum());
		Curriculum focus = currService.getOneItem(in.getFocus());
		Trainer trainer = trainerService.getOneItem(in.getTrainer());
		Trainer cotrainer = trainerService.getOneItem(in.getCotrainer());
		Timestamp startDate = in.getStartDate();
		Timestamp endDate = in.getEndDate();
		BatchStatusLookup status = new BatchStatusLookup(1, "Scheduled");
		List<Skill> skills = in.getSkills();

		Integer tempBuilding = in.getBuilding();
		Integer tempRoom = in.getRoom();

		if(tempBuilding < 1){ tempBuilding = null;}
		if(tempRoom < 1) { tempRoom = null; }

		BatchLocation bl = new BatchLocation();
		bl.setLocationId(in.getLocation());
		bl.setBuildingId(tempBuilding);
		bl.setRoomId(tempRoom);

		System.out.println(bl);

		bl = batchLocationService.saveItem(bl);
		
		Batch out = new Batch( ID, name, startDate, endDate, curriculum, status, trainer, cotrainer,   skills, focus, bl);
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
		} else if (all.isEmpty()) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No batches available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Batch> >(all, HttpStatus.OK);
		}
	}
	
}
