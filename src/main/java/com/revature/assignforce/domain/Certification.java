package com.revature.assignforce.domain;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

/**
 * Created by Zach Nelson on 2/1/2017.
 */

@Entity
@Table(name = "Certifications")
public class Certification {

    @Id
    @Column(name = "ID")
    @SequenceGenerator(allocationSize = 1, name = "certSeq", sequenceName = "CERT_ID_SEQ")
    @GeneratedValue(generator = "certSeq", strategy = GenerationType.SEQUENCE)
    private int id;

    @Column(name = "Cert_URL")
    private String file;

    @Column(name = "CERT_NAME")
    private String name;

    @Column(name = "TRAINER")
    private int trainer;

    public Certification() {
    	//noarg constructor
    }

    public Certification(int id, String file, String name, int trainer) {
        this.id = id;
        this.file = file;
        this.name = name;
        this.trainer = trainer;
    }

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

    @Override
    public String toString() {
        return "Certification{" +
                "ID = " + id +
                ", Name = '" + name + '\'' +
                '}';
    }
}
