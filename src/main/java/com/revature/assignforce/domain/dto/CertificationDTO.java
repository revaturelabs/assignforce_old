package com.revature.assignforce.domain.dto;

/**
 * Created by lazar on 2/20/2017.
 */
public class CertificationDTO {

    private int id;
    private String name;
    private String file;
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
