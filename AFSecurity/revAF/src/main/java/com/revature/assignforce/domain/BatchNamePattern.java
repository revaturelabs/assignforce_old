package com.revature.assignforce.domain;

import javax.persistence.*;

/**
 * Created by August Duet on 4/6/2017.
 */
@Entity
@Table(name = "BATCH_NAME_PATTERN")
public class BatchNamePattern {

    @Id
    @Column(name = "ID")
    @SequenceGenerator(allocationSize = 1, name = "patternSeq")
    @GeneratedValue(generator = "patternSeq", strategy = GenerationType.SEQUENCE)
    private Integer id;

    public BatchNamePattern(){}

    @Column(name = "PATTERN")
    private String pattern;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
