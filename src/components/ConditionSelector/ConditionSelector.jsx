import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import "./ConditionSelector.css";

const ConditionSelector = ({ value, onChange, error, helperText }) => {
  const { api } = useAuth();
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConditions();
  }, []);

  const fetchConditions = async () => {
    try {
      const response = await api.get("/get-conditions/");
      setConditions(response.data);
    } catch (err) {
      console.error("Error fetching conditions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl fullWidth error={!!error} margin="normal">
      <InputLabel>État</InputLabel>
      <Select
        value={value || ""}
        onChange={onChange}
        label="État"
        disabled={loading}
      >
        {conditions.map((condition) => (
          <MenuItem key={condition.id} value={condition.id}>
            {condition.display_name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default ConditionSelector;
