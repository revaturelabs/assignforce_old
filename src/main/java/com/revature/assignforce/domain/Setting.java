package com.revature.assignforce.domain;

import javax.persistence.*;

/**
 * Created by lazar on 2/8/2017.
 */
@Entity
@Table(name = "SETTINGS")
public class Setting{
    @Id
    @Column(name = "SETTING_ID")
    @SequenceGenerator(allocationSize = 1, name = "settingSeq")
    @GeneratedValue(generator = "settingSeq", strategy = GenerationType.SEQUENCE)
    private int settingId;

    @Column(name = "SETTING_NAME")
    private String settingName;

    @Column(name = "SETTING_VALUE")
    private Double settingValue;

    public Setting() {}

    public Setting(int settingId, String settingName, Double settingValue) {
        super();
        this.settingId = settingId;
        this.settingName = settingName;
        this.settingValue = settingValue;
    }

    public int getId() {
        return settingId;
    }

    public void setId(int settingId) {
        this.settingId = settingId;
    }

    public String getSettingName() {
        return settingName;
    }

    public void setSettingName(String settingName) {
        this.settingName = settingName;
    }

    public Double getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(Double settingValue) {
        this.settingValue = settingValue;
    }

    @Override
    public String toString() {
        return "Setting [ID=" + settingId + ", Name=" + settingName + ", Value="
                + settingValue + "]";
    }
}
