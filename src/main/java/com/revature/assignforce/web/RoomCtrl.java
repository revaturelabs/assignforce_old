package com.revature.assignforce.web;

import java.util.List;

import com.revature.assignforce.service.ActivatableObjectDaoService;
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

import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.RoomDTO;
import com.revature.assignforce.service.DaoService;

@RestController
@RequestMapping("/api/v2/room")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class RoomCtrl {

	@Autowired
	ActivatableObjectDaoService<Room, Integer> roomService;

	  // CREATE
		// creating new room object from information passed from room data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object createRoom( @RequestBody RoomDTO in ) {
	
		int ID = in.getRoomID();
		String name = in.getRoomName();
		List<Unavailable> unavailabilities = in.getUnavailabilities();
		
		Room out = new Room( ID, name, unavailabilities );
		out = roomService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Room failed to save."), HttpStatus.NOT_IMPLEMENTED);
		} else {
			return new ResponseEntity<Room>(out, HttpStatus.OK);
		}
	}
	
	  // RETRIEVE
		// retrieve room with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveRoom( @PathVariable("id") int ID ) {
		
		Room out = roomService.getOneItem(ID);
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No room found of ID " + ID + "."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<Room>(out, HttpStatus.OK);
		}
	}
	
	  // UPDATE
		// updating an existing room object with information passed from room data transfer object
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object updateRoom( @RequestBody RoomDTO in ) {
	
		int ID = in.getRoomID();
		String name = in.getRoomName();
		List<Unavailable> unavailabilities = in.getUnavailabilities();
		
		Room out = new Room( ID, name, unavailabilities );
		out = roomService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Room failed to update."), HttpStatus.NOT_MODIFIED);
		} else {
			return new ResponseEntity<Room>(out, HttpStatus.OK);
		}
	}
	
	  // DELETE
		// delete room with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object deleteRoom( @PathVariable("id") int ID ) {
		
		//Room delete = roomService.getOneItem(ID);
		roomService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all rooms
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Object retrieveAllRooms() {
		
		List<Room> all = roomService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all rooms failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty() == true) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No rooms available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Room> >(all, HttpStatus.OK);
		}
	}
	
}


