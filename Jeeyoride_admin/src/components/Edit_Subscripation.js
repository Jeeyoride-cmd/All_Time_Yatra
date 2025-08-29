import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";

export default function EditSubscription() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const [isActive, setIsActive] = useState(true);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    vehicle_type_id: "",
    title: "",
    days: 0,
    amount: 0,
  });

  const handleToggle = () => setIsActive(!isActive);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "days" || name === "amount") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/vehicle_list`);
      const data = await response.json();
      setVehicleOptions(data);
    } catch (error) {
      console.error("Failed to fetch vehicle list:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/get_subscription?id=${id}`);
      const data = await res.json();
      console.log("Fetched subscription data:", data);

      setForm({
        vehicle_type_id: data.vehicle_type_id || "",
        title: data.title || "",
        days: parseInt(data.days) || 0,
        amount: parseFloat(data.amount) || 0,
      });
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchSettings();
  }, [id]);

  const handleSubmit = async () => {
    try {
      console.log("Sending update request...");

      setMessage("Updating Successfully");
      setMessageType("info");

      const body = {
        id,
        ...form,
        vehicle_type_id: parseInt(form.vehicle_type_id),
        days: parseInt(form.days),
        amount: parseFloat(form.amount),
      };

      console.log("Request body:", body);

      const response = await fetch(`${BASE_URL}/update_subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response result:", result);

      if (response.ok && result.success) {
        setMessage(result.message || "Update successful!");
        setMessageType("success");
      } else {
        console.warn(
          "Update failed with message:",
          result.error || result.message
        );
        setMessage(result.error || result.message || "Update failed");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Something went wrong. Try again.");
      setMessageType("error");
    }
  };

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
              <center>
                <h4>Edit Subscription</h4>
              </center>
            </div>
          </div>

          <div className="chckout-card">
            {message && (
              <div
                style={{
                  position: "fixed",
                  top: "20px",
                  right: "20px",
                  padding: "15px",
                  backgroundColor:
                    messageType === "success"
                      ? "#4CAF50"
                      : messageType === "error"
                      ? "#F44336"
                      : "#2196F3",
                  color: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  display: "flex",
                  alignItems: "center",
                  minWidth: "300px",
                }}
              >
                <span>{message}</span>
                <button
                  onClick={() => setMessage("")}
                  style={{
                    marginLeft: "15px",
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Vehicle Type</label>
                <select
                  name="vehicle_type_id"
                  value={form.vehicle_type_id}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
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
                  value={form.title}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Validity Days</label>
                <input
                  type="number"
                  name="days"
                  placeholder="Validity (in days)"
                  value={form.days === 0 ? 0 : form.days || ""}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label className="inputlabel">Amount</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  step="0.01"
                  value={form.amount === 0 ? 0 : form.amount || ""}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
