import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";

const Add_Fare = () => {
  const [isActive, setIsActive] = useState(true);
  const [responseMsg, setResponseMsg] = useState("");
  const [cities, setCities] = useState([]);
  const [vehicle, setVehicle] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    vehicle_type_id: "",
    district_id: "",
    min_km: "",
    day_min_charge: "",
    night_min_charge: "",
    day_charge: "",
    night_charge: "",
    day_service_charge: "",
    night_service_charge: "",
    waiting_charge: "",
    traffic_charge: "",
  });

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Update button clicked");
    console.log("Form Data:", formData);

    try {
      const res = await fetch(`${BASE_URL}/update_fare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("API response:", data);

      setResponseMsg(data.message || "Updated");
      setTimeout(() => setResponseMsg(""), 3000);
    } catch (error) {
      console.error("Fetch error:", error);
      setResponseMsg("Failed to update fare");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log("Fare ID from URL:", id);
    if (id) {
      setFormData((prev) => ({ ...prev, id }));
    }
  }, []);

  useEffect(() => {
    const getvehicledata = async () => {
      try {
        const res = await fetch(`${BASE_URL}/get_fare?id=${formData.id}`);
        const data = await res.json();

        setFormData((prev) => ({
          ...prev,
          vehicle_type_id: data.vehicle_type_id || "",
          district_id: data.district_id || "",
          min_km: data.min_km || "",
          day_min_charge: data.day_min_charge || "",
          night_min_charge: data.night_min_charge || "",
          day_charge: data.day_charge || "",
          night_charge: data.night_charge || "",
          day_service_charge: data.day_service_charge || "",
          night_service_charge: data.night_service_charge || "",
          waiting_charge: data.waiting_charge || "",
          traffic_charge: data.traffic_charge || "",
        }));
      } catch (error) {
        console.error("Failed to fetch ride data:", error);
      }
    };

    if (formData.id) getvehicledata();
  }, [formData.id]);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/district_list`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch City List:", error);
    }
  };
  useEffect(() => {
    fetchCities();
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${BASE_URL}/fare_vehicle_list`);
        const data = await response.json();
        setVehicle(data); // or setVehicle(data.data) if it's nested
      } catch (error) {
        console.error("Failed to fetch vehicle list:", error);
      }
    };

    fetchVehicle();
  }, []);
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
              <span> Edit Fare</span>
              <a href="fares_list" className="backbutton">
                Back
              </a>
            </div>
            <div className="chckout-card">
              <form onSubmit={handleSubmit} className="fare-form">
                <input type="hidden" name="id" value={formData.id} />

                <div className="input-group">
                  <div className="input-field">
                    <label>Vehicle Type</label>
                    <select
                      name="vehicle_type_id"
                      value={formData.vehicle_type_id}
                      onChange={handleChange}
                      style={{ padding: "8px", width: "100%" }}
                      required
                    >
                      <option value="">-- Select a Vehicle --</option>
                      {vehicle.map((vehicle, index) => (
                        <option key={index} value={vehicle.id}>
                          {vehicle.vehicle_type_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-field">
                    <label>City Name</label>
                    <select
                      name="district_id"
                      value={formData.district_id}
                      onChange={handleChange}
                      style={{ padding: "8px", width: "100%" }}
                    >
                      <option value="">-- Select a city --</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city.id}>
                          {city.district_name}
                        </option>
                      ))}
                    </select>
                    {/* <input type="text" name="district_id"  value={formData.district_id} onChange={handleChange}  required /> */}
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Minimum KM</label>
                    <input
                      type="number"
                      name="min_km"
                      value={formData.min_km}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>Day Min Charge</label>
                    <input
                      type="number"
                      name="day_min_charge"
                      value={formData.day_min_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Night Min Charge</label>
                    <input
                      type="number"
                      name="night_min_charge"
                      value={formData.night_min_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>Day Charge (per KM)</label>
                    <input
                      type="number"
                      name="day_charge"
                      value={formData.day_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Night Charge (per KM)</label>
                    <input
                      type="number"
                      name="night_charge"
                      value={formData.night_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>Day Service Charge</label>
                    <input
                      type="number"
                      name="day_service_charge"
                      value={formData.day_service_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Night Service Charge</label>
                    <input
                      type="number"
                      name="night_service_charge"
                      value={formData.night_service_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-field">
                    <label>Waiting Charge</label>
                    <input
                      type="number"
                      name="waiting_charge"
                      value={formData.waiting_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field">
                    <label>Traffic Charge</label>
                    <input
                      type="number"
                      name="traffic_charge"
                      value={formData.traffic_charge}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-field"></div>{" "}
                  {/* empty for alignment */}
                </div>
                <button type="submit">Update Fare</button>
                {responseMsg && <p className="respondmessage">{responseMsg}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Fare;
