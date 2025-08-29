import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Your existing sidebar component
import { BASE_URL } from "./config";

export default function AddOrEditVehicle() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const [cities, setCities] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [preview, setPreview] = useState("");

  const isEditMode = !!id;

  const [form, setForm] = useState({
    id: id || "",
    vehicle_type_name: "",
    vehicle_type_minimum_earning: "",
    vehicle_type_registration_fee: "",
    offer_reg_fee_start_dt: "",
    offer_reg_fee_end_dt: "",
    offer_reg_fee: "",
    admin_name: "Admin",
    district_id: "",
    image: null,
  });

  const handleToggle = () => setIsActive(!isActive);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/district_list`);
      const data = await response.json();
      console.log(data);
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch City List:", error);
    }
  };

  const getVehicleData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getRide?id=${id}`);
      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        vehicle_type_name: data.vehicle_type_name || "",
        vehicle_type_minimum_earning: data.vehicle_type_minimum_earning || "",
        vehicle_type_registration_fee: data.vehicle_type_registration_fee || "",
        offer_reg_fee_start_dt: data.offer_reg_fee_start_dt || "",
        offer_reg_fee_end_dt: data.offer_reg_fee_end_dt || "",
        offer_reg_fee: data.offer_reg_fee || "",
        admin_name: data.admin_name || "Admin",
        district_id: data.district_id || "",
        image: data.image || null,
      }));

      if (data.image) {
        setPreview(`${BASE_URL}/images/${data.image}`);
      }
    } catch (error) {
      console.error("Failed to fetch ride data:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchCities(); // first fetch city list
      if (id) {
        await getVehicleData(); // then fetch vehicle data
      }
    };
    init();
  }, [id]);

  const handleSubmit = async () => {
    setMessage(`${isEditMode ? "Update" : "Add"} Successfully...`);
    setMessageType("info");

    try {
      const formData = new FormData();
      for (let key in form) {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      }

      const endpoint = isEditMode ? "updateRide" : "addRide";

      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage(
          result.message || `${isEditMode ? "Update" : "Addition"} successful!`
        );
        setMessageType("success");

        setTimeout(() => {
          navigate("/vehicle_list");
        }, 1500);
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setTimeout(() => setMessage(""), 3000);
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
          <div className="vehicle_type_name-card">
            <div className="headercard">
              <span>{isEditMode ? "Edit" : "Add"} Vehicle</span>
              <button
                onClick={() => navigate("/vehicle_list")}
                className="backbutton"
              >
                Back
              </button>
            </div>
          </div>

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

          {/* Form Fields */}
          <div className="chckout-card">
            {/* Title & City */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Title</label>
                <input
                  type="text"
                  name="vehicle_type_name"
                  placeholder="Title"
                  value={form.vehicle_type_name}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Select City</label>
                <select
                  name="district_id"
                  value={form.district_id}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                >
                  <option value="">-- Select a city --</option>
                  {cities.map((city, index) => {
                    const cityValue = city.id.toString();
                    return (
                      <option key={index} value={cityValue}>
                        {city.district_name}{" "}
                        {cityValue === form.district_id ? "(selected)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Fees and Earnings */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Registration Fee</label>
                <input
                  type="number"
                  name="vehicle_type_registration_fee"
                  value={form.vehicle_type_registration_fee}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Minimum Earning</label>
                <input
                  type="text"
                  name="vehicle_type_minimum_earning"
                  value={form.vehicle_type_minimum_earning}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
            </div>

            {/* Offer Dates */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Offer Registration Fee</label>
                <input
                  type="number"
                  name="offer_reg_fee"
                  value={form.offer_reg_fee}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Offer Start Date</label>
                <input
                  type="date"
                  name="offer_reg_fee_start_dt"
                  value={form.offer_reg_fee_start_dt?.split("T")[0] || ""}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
            </div>

            {/* Offer End & Image */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Offer End Date</label>
                <input
                  type="date"
                  name="offer_reg_fee_end_dt"
                  value={form.offer_reg_fee_end_dt?.split("T")[0] || ""}
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="inputlabel">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  style={{ padding: "8px", width: "100%" }}
                />
              </div>
            </div>

            {/* Admin Role */}
            <div style={{ marginBottom: "10px" }}>
              <label className="inputlabel">Admin Role</label>
              <select
                name="admin_name"
                value={form.admin_name}
                onChange={handleChange}
                style={{ padding: "8px", width: "100%" }}
              >
                <option value="Admin">Admin</option>
                <option value="Subadmin">Subadmin</option>
              </select>
            </div>

            {/* Preview Image */}
            {isEditMode && preview && (
              <div className="mb-3">
                <img src={preview} alt="Preview" width={80} height={80} />
              </div>
            )}

            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
