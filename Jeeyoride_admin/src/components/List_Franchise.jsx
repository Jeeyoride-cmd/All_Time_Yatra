import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import "datatables.net";
import "datatables.net-responsive";

const List_Franchise = () => {
  const [cities, setCities] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Fetch city list
  const fetchCities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Franchise_list`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Failed to fetch Franchise List:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Franchise?")) {
      try {
        const response = await fetch(`${BASE_URL}/delete_Franchise`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();
        if (result.success) {
          alert("Franchise deleted successfully");
          fetchCities(); // Refresh list
        } else {
          alert(result.message || "Failed to delete Franchise");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Server error while deleting Franchise");
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
            <span className="">List Franchise</span>
            <a href="/add_franchise" className="addcity">
              Add Franchise
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
                    <th>Name</th>
                    <th>Mobile No</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.length > 0 ? (
                    cities.map((franchise, index) => (
                      <tr key={franchise.id}>
                        <td>{index + 1}</td>
                        <td>{franchise.name}</td>
                        <td>{franchise.mobile_no}</td>
                        <td>{franchise.email}</td>
                        <td>{franchise.city}</td>
                        <td>{franchise.username}</td>
                        <td>{franchise.password}</td>

                        <td>
                          <button
                            className="notificationbtn"
                            onClick={() => handleDelete(franchise.id)}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No franchise found.
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

export default List_Franchise;
