package com.revature.assignforce.domain.dto;

import java.sql.Timestamp;
import java.util.Map;
import java.util.HashMap;

public class SalesforceBatchDTO {

    //variable naming used to match the naming conventions from the
    //salesforce database

    private String Id;
    private String Location;
    private String Name;
    private String Skill_Type;

    private Timestamp Batch_Start_Date__c;
    private Timestamp Batch_End_Date__c;

    private String Batch_Trainer__C;
    private String Co_Trainer__c;

    private SalesforceBatchAttributeDTO attributes;

    public SalesforceBatchDTO(){}

    //ID
    public String getId() {
        return Id;
    }
    public void setId(String id) {
        Id = id;
    }

    //Location
    public String getLocation() {
        return Location;
    }
    public void setLocation(String location) {
        Location = location;
    }

    //Name
    public String getName() {
        return Name;
    }
    public void setName(String batchName) {
        Name = batchName;
    }

    //Skill_Type
    public String getSkill_Type() {
        return Skill_Type;
    }
    public void setSkill_Type(String skill_Type) {
        Skill_Type = skill_Type;
    }

    public Timestamp getBatch_Start_Date__c() {
        return Batch_Start_Date__c;
    }

    public void setBatch_Start_Date__c(Timestamp batch_Start_Date__c) {
        Batch_Start_Date__c = batch_Start_Date__c;
    }

    public Timestamp getBatch_End_Date__c() {
        return Batch_End_Date__c;
    }

    public void setBatch_End_Date__c(Timestamp batch_End_Date__c) {
        Batch_End_Date__c = batch_End_Date__c;
    }

    public String getBatch_Trainer__C() {
        return Batch_Trainer__C;
    }

    public void setBatch_Trainer__C(String batch_Trainer__C) {
        Batch_Trainer__C = batch_Trainer__C;
    }

    public String getCo_Trainer__c() {
        return Co_Trainer__c;
    }

    public void setCo_Trainer__c(String co_Trainer__c) {
        Co_Trainer__c = co_Trainer__c;
    }

    public SalesforceBatchAttributeDTO getAttributes() {
        return attributes;
    }

    public void setAttributes(SalesforceBatchAttributeDTO attributes) {
        this.attributes = attributes;
    }

    public String toJsonString(){
        String jsonString =
            "{\"Location__c\":\""  + getLocation() + "\"," +
            "\"Name\":\"" + getName() + "\"," +
            "\"Skill_Type__c\":\"" + getSkill_Type() + "\"," +
            "\"Batch_Start_Date__c\":\"" + getBatch_Start_Date__c().getTime() + "\"," +
            "\"Batch_End_Date__c\":\"" + getBatch_End_Date__c().getTime() + "\"," +
            "\"Batch_Trainer__c\":\"" + getBatch_Trainer__C() + "\"," +
            "\"Co_Trainer__c\":\"" + getCo_Trainer__c() + "\"}";
        return jsonString;
    }
}
