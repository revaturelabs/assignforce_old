package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by Zach Nelson on 2/9/2017.
 */
@ApiModel("SkillDTO")
public class SkillDTO {

    @ApiModelProperty(notes = "The skill ID", name = "skillId", dataType = "int")
    private int skillId;
    @ApiModelProperty(notes = "The skill name", name = "name", dataType = "String")
    private String name;
    @ApiModelProperty(notes = "A boolean that marks the skill active or not", name = "active", dataType = "Boolean")
    private Boolean active;

    public int getSkillId() {
        return skillId;
    }
    public void setSkillId(int skillId) {
        this.skillId = skillId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Boolean getActive() {
        return active;
    }
    public void setActive(Boolean active) {
        this.active = active;
    }
}
