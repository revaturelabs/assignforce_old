package com.revature.assignforce.web;

import com.revature.assignforce.domain.*;
import com.revature.assignforce.domain.dto.BatchDTO;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.service.BatchLocationDaoService;
import com.revature.assignforce.service.DaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/api/v2/batch")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class BatchCtrl {

	@PersistenceContext
	private EntityManager em;

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
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
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

	@RequestMapping(method=RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateBatch(@RequestBody BatchDTO in){

		//try to get batch from database
		Batch b = batchService.getOneItem(in.getID());

		if(b == null){
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No batch with id '" + in.getID() + "' could be found to update"), HttpStatus.NOT_FOUND);
		}

		b.setName(in.getName());
		b.setSkills(in.getSkills());
		b.setStartDate(in.getStartDate());
		b.setEndDate(in.getEndDate());

		if(in.getCurriculum() < 1){
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Curriculum cannot be null"), HttpStatus.BAD_REQUEST);
		}
		Curriculum c = currService.getOneItem(in.getCurriculum());
		Curriculum f = currService.getOneItem(in.getFocus());

		b.setCurriculum(c);
		b.setFocus(f);

		Trainer t = trainerService.getOneItem(in.getTrainer());
		Trainer ct = trainerService.getOneItem(in.getCotrainer());

		BatchLocation bl = batchLocationService.getOneItem(b.getBatchLocation().getId());
		Integer tempLocationId = (in.getLocation() > 0 ? in.getLocation() : null);
		Integer tempBuildingId = (in.getBuilding() > 0 ? in.getBuilding() : null);
		Integer tempRoomId = (in.getRoom() > 0 ? in.getRoom() : null);
		bl.setLocationId(tempLocationId);
		bl.setBuildingId(tempBuildingId);
		bl.setRoomId(tempRoomId);

		batchLocationService.saveItem(bl);
		bl = ((BatchLocationDaoService)batchLocationService).refresh(bl);
		b.setBatchLocation(bl);


		try{
			batchService.saveItem(b);
		}catch (Exception ex){
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO(ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Batch>(b, HttpStatus.OK);
	}
	
}
