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
    private int ID;

    @Column(name = "Cert_URL")
    private String url;

    @ManyToOne
    @JoinColumn(name = "Trainer")
    @Fetch(FetchMode.JOIN)
    private Trainer trainer;

    public Certification() {
    }

    public Certification(String url, Trainer trainer) {
        this.url = url;
        this.trainer = trainer;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Trainer getTrainer() {
        return trainer;
    }

    public void setTrainer(Trainer trainer) {
        this.trainer = trainer;
    }

    @Override
    public String toString() {
        return "Certification{" +
                "ID = " + ID +
                ", url = '" + url + '\'' +
                ", trainer = " + trainer +
                '}';
    }
}
