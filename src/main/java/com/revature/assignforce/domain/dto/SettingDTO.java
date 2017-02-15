package com.revature.assignforce.domain.dto;

/**
 * Created by lazar on 2/8/2017.
 */
public class SettingDTO {
    private int settingId;
    private String settingName;
    private int settingValue;

    //ID
    public int getSettingId() {
        return settingId;
    }
    public void setSettingId(int settingId) {
        this.settingId = settingId;
    }

    //Name
    public String getSettingName() {
        return settingName;
    }
    public void setSettingName(String settingName) {
        this.settingName = settingName;
    }

    //Value
    public int getSettingValue() {
        return settingValue;
    }
    public void setSettingValue(int settingValue) {
        this.settingValue = settingValue;
    }

    @Override
    public String toString() {
        return "Setting [ID=" + settingId + ", Name=" + settingName + ", Value="
                + settingValue + "]";
    }
}
