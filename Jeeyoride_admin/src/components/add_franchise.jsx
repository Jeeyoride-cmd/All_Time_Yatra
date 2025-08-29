import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

const AddAdminForm = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    mobile_no: "",
    city: "",
    userrole: 5,
  });
  const [districts, setDistricts] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/Franchise_city_list`)
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Franchise added successfully!");
    setTimeout(() => {
      setMessage("");
      navigate("/list_franchise");
    }, 3000);

    try {
      const res = await axios.post(`${BASE_URL}/add_franchise`, form);
      setMessage(res.data.message || "Franchise added successfully!");
      setMessageType("success");

      // Hide message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while adding franchise.");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
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
              <span>Add Franchise</span>
              <a href="list_franchise" className="backbutton">
                Back
              </a>
            </div>
            <div className="chckout-card">
              <form
                onSubmit={handleSubmit}
                style={{ maxWidth: "100%", margin: "auto" }}
              >
                <div className="input-group">
                  <div
                    className="input-field"
                    style={{ marginBottom: "20px", flex: 1 }}
                  >
                    <label className="text-white">Name</label>
                    <input
                      name="name"
                      onChange={handleChange}
                      placeholder="Name"
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div
                    className="input-field"
                    style={{ marginBottom: "20px", flex: 1 }}
                  >
                    <label className="text-white">Username</label>
                    <input
                      name="username"
                      onChange={handleChange}
                      placeholder="Username"
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div
                    className="input-field"
                    style={{ marginBottom: "20px", flex: 1 }}
                  >
                    <label className="text-white">Password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      placeholder="Password"
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <div
                    className="input-field"
                    style={{ marginBottom: "20px", flex: 1 }}
                  >
                    <label className="text-white">Email</label>
                    <input
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div
                    className="input-field"
                    style={{ marginBottom: "20px", flex: 1 }}
                  >
                    <label className="text-white">Mobile No</label>
                    <input
                      name="mobile_no"
                      onChange={handleChange}
                      placeholder="Mobile No"
                      className="border p-2 w-full"
                      required
                      minLength={10}
                      maxLength={10}
                    />
                  </div>

                  <div
                    className="input-field"
                    style={{ marginBottom: "20px", flex: 1 }}
                  >
                    <label className="text-white">City Name</label>
                    <select
                      name="city"
                      onChange={handleChange}
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">-- Select City --</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.district_name}>
                          {dist.district_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" style={{ marginTop: "15px" }}>
                  Submit
                </button>

                {message && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      color: messageType === "success" ? "green" : "White",
                      borderRadius: "5px",
                    }}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdminForm;
