package com.scat.model.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Api_Response {
    @JsonProperty("Status")
    private String status;

    @JsonProperty("PostOffice")
    private List<PostOffice> postOffices;

    // Getters and setters

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<PostOffice> getPostOffices() {
        return postOffices;
    }

    public void setPostOffices(List<PostOffice> postOffices) {
        this.postOffices = postOffices;
    }

    public static class PostOffice {
        @JsonProperty("Name")
        private String name;

        @JsonProperty("Taluk")
        private String taluk;

        @JsonProperty("District")
        private String district;

        @JsonProperty("Pincode")
        private String pincode;

        // Getters and setters

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getTaluk() {
            return taluk;
        }

        public void setTaluk(String taluk) {
            this.taluk = taluk;
        }

        public String getDistrict() {
            return district;
        }

        public void setDistrict(String district) {
            this.district = district;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }
    }
}