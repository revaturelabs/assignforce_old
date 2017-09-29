package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by lazar on 2/20/2017.
 */
@ApiModel("CertificationDTO")
public class CertificationDTO {

    @ApiModelProperty(notes = "The certification ID", name = "ID", dataType = "int")
    private int id;
    @ApiModelProperty(notes = "The name of the certification", name = "name", dataType = "String")
    private String name;
    @ApiModelProperty(notes = "The certification file", name = "file", dataType = "String")
    private String file;
    @ApiModelProperty(notes = "the certification trainer number", name = "trainer", dataType = "int")
    private int trainer;


    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getFile() {
        return file;
    }
    public void setFile(String file) {
        this.file = file;
    }

    public int getTrainer() {
        return trainer;
    }
    public void setTrainer(int trainer) {
        this.trainer = trainer;
    }
}
