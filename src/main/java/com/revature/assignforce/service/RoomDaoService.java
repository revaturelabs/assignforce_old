package com.revature.assignforce.service;

import com.revature.assignforce.domain.Room;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class RoomDaoService extends ActivatableObjectDaoService<Room, Integer> {

}
