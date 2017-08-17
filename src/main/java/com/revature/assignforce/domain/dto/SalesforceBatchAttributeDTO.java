package com.revature.assignforce.domain.dto;

public class SalesforceBatchAttributeDTO {

    String type;
    String url;

    public SalesforceBatchAttributeDTO(){}

    public SalesforceBatchAttributeDTO(String aType, String aUrl){
        type = aType;
        url = aUrl;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}
