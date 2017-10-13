package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by lazar on 2/8/2017.
 */
@ApiModel("Setting")
public class SettingDTO {

    @ApiModelProperty(notes = "The setting ID", name = "settingId", dataType = "int")
    private int settingId;
    @ApiModelProperty(notes = "The setting name", name = "settingName", dataType = "String")
    private String settingName;
    @ApiModelProperty(notes = "The setting value number", name = "setttingValue", dataType = "int")
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
