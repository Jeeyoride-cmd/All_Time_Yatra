import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2";

const Add_New_Fare = () => {
  const [isActive, setIsActive] = useState(true);
  const [responseMsg, setResponseMsg] = useState("");
  const [cities, setCities] = useState([]);
  const districtSelectRef = useRef();

  const [vehicle, setVehicle] = useState([]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchCities = async () => {
      const res = await fetch(`${BASE_URL}/city_list`);
      const data = await res.json();
      setCities(data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      $("#district_select").select2();
    }
  }, [cities]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${BASE_URL}/fare_vehicle_list`);
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error("Failed to fetch vehicle list:", error);
      }
    };
    fetchVehicle();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = {
      vehicle_type_id: form.vehicle_type_id.value,
      district_ids: $("#district_select").val()?.map(Number) || [],
      min_km: parseFloat(form.min_km.value) || 0,
      day_min_charge: parseFloat(form.day_min_charge.value) || 0,
      night_min_charge: parseFloat(form.night_min_charge.value) || 0,
      day_charge: parseFloat(form.day_charge.value) || 0,
      night_charge: parseFloat(form.night_charge.value) || 0,
      day_service_charge: parseFloat(form.day_service_charge.value) || 0,
      night_service_charge: parseFloat(form.night_service_charge.value) || 0,
      waiting_charge: parseFloat(form.waiting_charge.value) || 0,
      traffic_charge: parseFloat(form.traffic_charge.value) || 0,
    };

    try {
      const res = await fetch(`${BASE_URL}/add_fare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponseMsg(data.message);
      setTimeout(() => setResponseMsg(""), 3000);
    } catch (error) {
      setResponseMsg("Error submitting fare.");
      setTimeout(() => setResponseMsg(""), 3000);
    }
  };

  const fareFields = [
    ["min_km", "Minimum KM"],
    ["day_min_charge", "Day Min Charge"],
    ["night_min_charge", "Night Min Charge"],
    ["day_charge", "Day Charge (per KM)"],
    ["night_charge", "Night Charge (per KM)"],
    ["day_service_charge", "Day Service Charge"],
    ["night_service_charge", "Night Service Charge"],
    ["waiting_charge", "Waiting Charge"],
    ["traffic_charge", "Traffic Charge"],
  ];

  const groupedFields = [];
  for (let i = 0; i < fareFields.length; i += 2) {
    groupedFields.push(fareFields.slice(i, i + 2));
  }

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="driver-card-body">
          <div className="title-card">
            <div className="headercard">
              <span>Add Fare</span>
              <a href="fares_list" className="backbutton">
                Back
              </a>
            </div>
            <div className="chckout-card">
              <form onSubmit={handleSubmit} className="fare-form">
                <div className="input-group">
                  <div className="input-field" style={{ marginBottom: "20px" }}>
                    <label>City Name</label>
                    <select
                      id="district_select"
                      ref={districtSelectRef}
                      className="form-control"
                      multiple
                      style={{ width: "100%" }}
                    >
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.district_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-field" style={{ marginBottom: "20px" }}>
                    <label>Vehicle Type</label>
                    <select name="vehicle_type_id">
                      <option value="">-- Select a Vehicle --</option>
                      {vehicle.map((vehicledata) => (
                        <option key={vehicledata.id} value={vehicledata.id}>
                          {vehicledata.vehicle_type_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {groupedFields.map((group, idx) => (
                  <div
                    key={idx}
                    className="input-group"
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    {group.map(([name, label]) => (
                      <div
                        key={name}
                        className="input-field"
                        style={{ flex: 1 }}
                      >
                        <label>{label}</label>
                        <input type="number" name={name} step="0.01" />
                      </div>
                    ))}
                    {group.length === 1 && <div style={{ flex: 1 }}></div>}
                  </div>
                ))}

                <button type="submit">Add Fare</button>
                {responseMsg && <p className="respondmessage">{responseMsg}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_New_Fare;
