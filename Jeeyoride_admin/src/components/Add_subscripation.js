import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";

export default function EditSubscription() {
  const [isActive, setIsActive] = useState(true);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_type_id: "",
    title: "",
    days: "",
    amount: "",
  });

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/add_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Subscription added successfully!");
        setFormData({ vehicle_type_id: "", title: "", days: "", amount: "" });
      } else {
        alert("Failed to add subscription");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/vehicle_list`);
        const data = await response.json();
        setVehicleOptions(data);
      } catch (error) {
        console.error("Failed to fetch vehicle list:", error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="driver-card-body">
          <div class="headercard">
            <center>
              <h4>Add Subscription</h4>
            </center>
          </div>
          <div className="chckout-card">
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Vehicle Type</label>
                <select
                  name="vehicle_type_id"
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleOptions.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_type_name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel"> Validity Days</label>
                <input
                  type="number"
                  name="days"
                  placeholder="Validity (in days)"
                  value={formData.days}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Amount</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                padding: "5px 15px",
                backgroundColor: "cyan",
                color: "black",
                borderRadius: "20px",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
