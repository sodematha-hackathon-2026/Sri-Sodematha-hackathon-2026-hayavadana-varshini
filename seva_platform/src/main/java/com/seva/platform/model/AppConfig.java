package com.seva.platform.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_config")
public class AppConfig {
    @Id
    private String configKey;
    private String configValue;
    private boolean enabled;

    public AppConfig() {
    }

    public AppConfig(String configKey, String configValue, boolean enabled) {
        this.configKey = configKey;
        this.configValue = configValue;
        this.enabled = enabled;
    }

    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public String getConfigValue() {
        return configValue;
    }

    public void setConfigValue(String configValue) {
        this.configValue = configValue;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
