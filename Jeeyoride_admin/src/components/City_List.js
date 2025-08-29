import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import "datatables.net";
import "datatables.net-responsive";
import $ from "jquery";

const City_List = () => {
  const [cities, setCities] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Fetch city list
  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/city_list`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch City List:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (cities.length > 0 && tableRef.current) {
      const table = $(tableRef.current).DataTable({
        destroy: true,
        responsive: true,
      });

      return () => {
        table.destroy();
      };
    }
  }, [cities]);

  // Handle status toggle (Active/Inactive)
  const toggleCityStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    const actionText = newStatus === 1 ? "activate" : "inactivate";

    const confirmAction = window.confirm(
      `Are you sure you want to ${actionText} this city?`
    );

    if (!confirmAction) return;

    try {
      const response = await fetch(
        `${BASE_URL}/active_inactive?id=${id}&status=${newStatus}`
      );
      const result = await response.json();
      alert(result.message);
      fetchCities(); // Refresh list
    } catch (error) {
      console.error("Error updating city status:", error);
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
            <span className="">City List</span>
            <a href="/add_city" className="addcity">
              Add City
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
                    <th>City Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.length > 0 ? (
                    cities.map((city, index) => (
                      <tr key={city.id}>
                        <td>{index + 1}</td>
                        <td>{city.district_name}</td>
                        <td>
                          <button
                            onClick={() =>
                              toggleCityStatus(city.id, city.status)
                            }
                            style={{
                              background: city.status === 0 ? "red" : "green",
                              padding: "10px",
                              borderRadius: "10px",
                              color: "white",
                              border: "none",
                            }}
                          >
                            {city.status === 1 ? "Active" : "InActive"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No cities found.
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

export default City_List;
