import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";

// Import required JS libraries
import "datatables.net";
import "datatables.net-responsive";
import $ from "jquery"; // Make sure jQuery is imported

const Fares = () => {
  const [gateways, setGateways] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Fetch data
  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const response = await fetch(`${BASE_URL}/fares`);
        const data = await response.json();
        setGateways(data);
      } catch (error) {
        console.error("Failed to fetch Fares:", error);
      }
    };

    fetchGateways();
  }, []);

  // Initialize DataTable + attach delete handler
  useEffect(() => {
    if (gateways.length > 0 && tableRef.current) {
      const table = $(tableRef.current).DataTable({
        destroy: true,
        responsive: true,
      });

      // Clean previous handlers
      $("#example tbody").off("click", ".btn-delete");

      // Attach event to dynamically generated delete buttons
      $("#example tbody").on("click", ".btn-delete", function () {
        const id = $(this).data("id");
        handleDelete(id);
      });

      return () => {
        table.destroy();
        $("#example tbody").off("click", ".btn-delete");
      };
    }
  }, [gateways]);

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fare?")) {
      try {
        const response = await fetch(`${BASE_URL}/delete_fare`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();
        if (result.success) {
          setGateways((prev) => prev.filter((item) => item.id !== id));
          alert("Fare deleted successfully.");
          window.location.reload();
        } else {
          alert("Failed to delete fare.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting the fare.");
      }
    }
  };

  return (
    <>
      {/* CDN Stylesheets */}
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
            <span>Fare List</span>
            <a href="/add_new_fare" className="addcity">
              Add Fare
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
                    <th>Vehicle Type</th>
                    <th>City</th>
                    <th>Minimum Km</th>
                    <th>Day Min Charge</th>
                    <th>Night Min Charge</th>
                    <th>Day Charge</th>
                    <th>Night Charge</th>
                    <th>Day Service Charge</th>
                    <th>Night Service Charge</th>
                    <th>Waiting Charge</th>
                    <th>Traffic Charge</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gateways.length > 0 ? (
                    gateways.map((gateway, index) => (
                      <tr key={gateway.id}>
                        <td>{index + 1}</td>
                        <td>{gateway.vehicle_type}</td>
                        <td>{gateway.city_name}</td>
                        <td>{gateway.min_km}</td>
                        <td>{gateway.day_min_charge}</td>
                        <td>{gateway.night_min_charge}</td>
                        <td>{gateway.day_charge}</td>
                        <td>{gateway.night_charge}</td>
                        <td>{gateway.day_service_charge}</td>
                        <td>{gateway.night_service_charge}</td>
                        <td>{gateway.waiting_charge}</td>
                        <td>{gateway.traffic_charge}</td>
                        <td>
                          <a href={`/add_fare?id=${gateway.id}`}>
                            <i className="fa fa-edit mr-2"></i>
                          </a>
                          <button
                            className="btn-delete"
                            data-id={gateway.id}
                            style={{
                              color: "red",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            title="Delete"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center py-4">
                        No fares found.
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

export default Fares;
