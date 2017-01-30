package com.revature.assignforce.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.revature.assignforce.domain.Room;

@Transactional
@Service
public class RoomDaoService extends ActivatableObjectDaoService<Room, Integer> {

}
