package com.revature.assignforce.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "BATCH_STATUS_LOOKUP")
public class BatchStatusLookup {

	@Id
	@Column(name = "Batch_Status_ID")
	@SequenceGenerator(allocationSize = 1, name = "batch_status_seq", sequenceName = "batch_status_seq")
	@GeneratedValue(generator = "batch_status_seq", strategy = GenerationType.SEQUENCE)
	private int batchStatusID;
	
	@Column(name = "BS_NAME", unique=true, nullable=false)
	private String batchStatusName;

	public BatchStatusLookup(){}
	public BatchStatusLookup(int batchStatusID, String batchStatusName) {
		super();
		this.batchStatusID = batchStatusID;
		this.batchStatusName = batchStatusName;
	}

	
	
	public int getBatchStatusID() {
		return batchStatusID;
	}

	public void setBatchStatusID(int batchStatusID) {
		this.batchStatusID = batchStatusID;
	}

	public String getBatchStatusName() {
		return batchStatusName;
	}

	public void setBatchStatusName(String batchStatusName) {
		this.batchStatusName = batchStatusName;
	}


	
	
}
