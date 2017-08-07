package com.revature.assignforce.web;

import java.util.List;

import com.revature.assignforce.annotations.Authorize;
import com.revature.assignforce.service.ActivatableObjectDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.revature.assignforce.domain.Room;
import com.revature.assignforce.domain.Unavailable;
import com.revature.assignforce.domain.dto.ResponseErrorDTO;
import com.revature.assignforce.domain.dto.RoomDTO;

@RestController
@RequestMapping("/api/v2/room")
@ComponentScan(basePackages="com.revature.assignforce.service")
public class RoomCtrl {

	@Autowired
	ActivatableObjectDaoService<Room, Integer> roomService;

	  // CREATE
		// creating new room object from information passed from room data transfer object
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object createRoom(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
							 @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
							 @RequestBody RoomDTO in ) {
	
		int ID = in.getRoomID();
		String name = in.getRoomName();
		int building = in.getBuilding();

		List<Unavailable> unavailabilities = in.getUnavailabilities();
		
		Room out = new Room( ID, name, building, unavailabilities );
		out = roomService.saveItem( out );
		
		if (out == null) {
			return new ResponseEntity<ResponseErrorDTO>( new ResponseErrorDTO("Room failed to save."), HttpStatus.INTERNAL_SERVER_ERROR);
		} else {
			return new ResponseEntity<Room>(out, HttpStatus.OK);
		}
	}
	
	  // RETRIEVE
		// retrieve room with given ID
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object retrieveRoom(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
							   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
							   @PathVariable("id") int ID ) {
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
	@Authorize
	public Object updateRoom( @CookieValue("JSESSIONID") String cookiesessionIdCookie,
							  @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
							  @RequestBody RoomDTO in ) {
		int ID = in.getRoomID();
		String name = in.getRoomName();
		int building = in.getBuilding();
		
		List<Unavailable> unavailabilities = in.getUnavailabilities();
		Boolean active = in.getActive();
		Room out = new Room( ID, name, building, unavailabilities, active);
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
	@Authorize
	public Object deleteRoom( @CookieValue("JSESSIONID") String cookiesessionIdCookie,
							  @RequestHeader(value="X-XSRF-TOKEN") String tokenValue,
							  @PathVariable("id") int ID ) {
		roomService.deleteItem(ID);
		return new ResponseEntity<Object>(null, HttpStatus.OK);
	}
	
	  // GET ALL
		// retrieve all rooms
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Authorize
	public Object retrieveAllRooms(@CookieValue("JSESSIONID") String cookiesessionIdCookie,
								   @RequestHeader(value="X-XSRF-TOKEN") String tokenValue) {
		List<Room> all = roomService.getAllItems();
		if (all == null) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("Fetching all rooms failed."), HttpStatus.NOT_FOUND);
		} else if (all.isEmpty()) {
			return new ResponseEntity<ResponseErrorDTO>(new ResponseErrorDTO("No rooms available."), HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity< List<Room> >(all, HttpStatus.OK);
		}
	}	
}