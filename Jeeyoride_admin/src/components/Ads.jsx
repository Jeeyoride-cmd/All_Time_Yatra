import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

const AddAdForm = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("home");
  const [image, setImage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image.");
      setMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("image", image);

    setError("");
    setMessage("Ads added successfully");
    setTimeout(() => {
      setMessage("");
      navigate("/ads_list"); // change to your actual route
    }, 3000);

    try {
      const response = await fetch(`${BASE_URL}/ads_upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError("❌ Upload failed: " + errorText);
        setMessage("");
        setTimeout(() => setError(""), 3000); // ⏱ clear error after 3s
        return;
      }

      const result = await response.json();
      setMessage("✅ " + result.message);
      setError("");
      setTimeout(() => setMessage(""), 3000); // ⏱ clear success after 3s
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("❌ Upload failed: " + err.message);
      setMessage("");
      setTimeout(() => setError(""), 3000); // ⏱ clear error after 3s
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
          <div className="headercard">
            <center>
              <h4>Add Ads</h4>
            </center>
            <div className="chckout-card">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="input-group">
                  <div className="input-field" style={{ marginBottom: "20px" }}>
                    <label>Title</label>
                    <input
                      type="text"
                      className="border p-2 w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-field" style={{ marginBottom: "20px" }}>
                    <label>Ads Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="home">Home</option>
                      <option value="ride">Ride</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-field" style={{ marginBottom: "20px" }}>
                    <label>Ads Image</label>
                    <input
                      style={{ height: "45px" }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                {message && (
                  <p style={{ color: "white", marginTop: "10px" }}>{message}</p>
                )}
                {error && (
                  <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdForm;
