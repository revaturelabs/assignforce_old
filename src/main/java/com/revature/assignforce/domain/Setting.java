package com.revature.assignforce.domain;

import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * Created by lazar on 2/8/2017.
 */
@Entity
@Table(name = "SETTINGS")
public class Setting{
    @Id
    @Column(name = "ID")
    @SequenceGenerator(allocationSize = 1, name = "settingSeq")
    @GeneratedValue(generator = "settingSeq", strategy = GenerationType.SEQUENCE)
    private int settingId;

    @Column(name = "SETTING_ALIAS")
    private String alias;

    @Column(name = "SETTING_TRS_PER_PG")
    private Integer trainersPerPage;

    @Column(name="SETTING_RPT_GRDS")
    private Integer reportGrads;

    @Column(name="SETTING_RPT_BTCH_LEN")
    private Integer batchLength;

    @Column(name="SETTING_RPT_INC_GRADS")
    private Integer reportIncomingGrads;

    @Column(name="SETTING_DFT_MIN_BTCH_SZ")
    private Integer minBatchSize;

    @Column(name="SETTING_DFT_MAX_BTCH_SZ")
    private Integer maxBatchSize;

    @Column(name="SETTING_MIN_TR_BRK")
    private Integer trainerBreakDays;

    @Column(name="SETTING_DFT_BTCH_LOC")
    private Integer defaultLocation;

    @Column(name="SETTING_DFT_BTCH_BLD")
    private Integer defaultBuilding;

    @Column(name="SETTING_DFT_NAME_PTRN")
    private String defaultNamePattern;

    public Setting() {
    	//noarg constructor
    }

    public int getSettingId() {
        return settingId;
    }

    public void setSettingId(int settingId) {
        this.settingId = settingId;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public Integer getTrainersPerPage() {
        return trainersPerPage;
    }

    public void setTrainersPerPage(Integer trainersPerPage) {
        this.trainersPerPage = trainersPerPage;
    }

    public Integer getReportGrads() {
        return reportGrads;
    }

    public void setReportGrads(Integer reportGrads) {
        this.reportGrads = reportGrads;
    }

    public Integer getBatchLength() {
        return batchLength;
    }

    public void setBatchLength(Integer batchLength) {
        this.batchLength = batchLength;
    }

    public Integer getReportIncomingGrads() {
        return reportIncomingGrads;
    }

    public void setReportIncomingGrads(Integer reportIncomingGrads) {
        this.reportIncomingGrads = reportIncomingGrads;
    }

    public Integer getMinBatchSize() {
        return minBatchSize;
    }

    public void setMinBatchSize(Integer minBatchSize) {
        this.minBatchSize = minBatchSize;
    }

    public Integer getMaxBatchSize() {
        return maxBatchSize;
    }

    public void setMaxBatchSize(Integer maxBatchSize) {
        this.maxBatchSize = maxBatchSize;
    }

    public Integer getTrainerBreakDays() {
        return trainerBreakDays;
    }

    public void setTrainerBreakDays(Integer trainerBreakDays) {
        this.trainerBreakDays = trainerBreakDays;
    }

    public Integer getDefaultLocation() {
        return defaultLocation;
    }

    public void setDefaultLocation(Integer defaultLocation) {
        this.defaultLocation = defaultLocation;
    }

    public Integer getDefaultBuilding() {
        return defaultBuilding;
    }

    public void setDefaultBuilding(Integer defaultBuilding) {
        this.defaultBuilding = defaultBuilding;
    }

    public String getDefaultNamePattern() {
        return defaultNamePattern;
    }

    public void setDefaultNamePattern(String defaultNamePattern) {
        this.defaultNamePattern = defaultNamePattern;
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
