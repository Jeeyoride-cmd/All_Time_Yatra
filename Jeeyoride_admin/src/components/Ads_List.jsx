import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import "datatables.net";
import "datatables.net-responsive";

const Ads_List = () => {
  const [cities, setCities] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Fetch city list
  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/ads_list`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch Ads List:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Ads?")) {
      try {
        const response = await fetch(`${BASE_URL}/delete_ads`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();
        if (result.success) {
          alert("Ads deleted successfully");
          fetchCities(); // Refresh list
        } else {
          alert(result.message || "Failed to delete notification");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Server error while deleting notification");
      }
    }
  };

  return (
    <>
      {/* CDN Styles */}
      <link
        rel="stylesheet"
        href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.datatables.net/responsive/2.4.1/css/responsive.dataTables.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />

      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="driver-card-body">
          <div className="headercard">
            <span className="">Ads List</span>
            <a href="/ads" className="addcity">
              Add Ads
            </a>
          </div>

          <div className="chckout-card">
            <div className="overflow-x-auto">
              <table
                ref={tableRef}
                id="example"
                className="display nowrap"
                style={{ width: "100%" }}
              >
                <thead className="bg-gray-100">
                  <tr>
                    <th>Sr.No</th>
                    <th>User Type</th>
                    <th>Title</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.length > 0 ? (
                    cities.map((notification, index) => (
                      <tr key={notification.id}>
                        <td>{index + 1}</td>
                        <td>{notification.type}</td>
                        <td>{notification.title}</td>

                        <td>
                          <button
                            className="notificationbtn"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No Ads Record found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ads_List;
