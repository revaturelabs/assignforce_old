package com.revature.assignforce.domain.dto;

import io.swagger.annotations.ApiModel;

/**
 * Created by Zach Nelson on 2/9/2017.
 */
@ApiModel("SkillDTO")
public class SkillDTO {

    private int skillId;
    private String name;
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
