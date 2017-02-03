package com.revature.assignforce.service;

import com.revature.assignforce.domain.Batch;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class BatchDaoService extends DaoService<Batch, Integer> {

}
