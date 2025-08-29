import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";

function Vehicle_list() {
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);

  const handleToggle = () => setIsActive(!isActive);

  // ✅ DELETE handler
  const handleDelete = async (id) => {
    console.log("Calling delete API with ID:", id);

    if (!id) {
      alert("Invalid vehicle ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const response = await fetch(`${BASE_URL}/delete_vehicle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: parseInt(id) }), // Send vehicle_id
        });

        const result = await response.json();
        if (result.success) {
          alert("Vehicle deleted successfully.");
          $(tableRef.current).DataTable().ajax.reload(); // Refresh table
        } else {
          alert("Failed to delete vehicle.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting the vehicle.");
      }
    }
  };

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    table.DataTable({
      processing: true,
      responsive: true,
      ajax: {
        url: `${BASE_URL}/All_vehicle_list`,
        type: "GET",
        dataSrc: "",
      },
      columns: [
        {
          data: null,
          render: (data, type, row, meta) =>
            meta.row + meta.settings._iDisplayStart + 1,
          orderable: false,
        },
        { data: "vehicle_type_name" },
        {
          data: "vehicle_type_image",
          render: (data) =>
            `<img src="${BASE_URL}/uploads/${data}" alt="Vehicle" width="50" height="50"/>`,
        },
        { data: "vehicle_type_minimum_earning" },
        { data: "vehicle_type_registration_fee" },
        {
          data: "status",
          render: (data, type, row) => {
            return data === 1
              ? `<a href="#" class="Publish">Publish</a>`
              : `<a href="#" class="unPublish">Un-Publish</a>`;
          },
        },
        {
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return `
              <a href="Vehicle?id=${row.vehicle_id}" class="view-btn" title="Edit">
                <i class="fa fa-edit"></i>
              </a>
              <button 
                class="btn-delete" 
                data-id="${row.vehicle_id}" 
                style="color:red; background:none; border:none; cursor:pointer;" 
                title="Delete"
              >
                <i class="fa fa-trash"></i>
              </button>`;
          },
        },
      ],
    });

    // ✅ Bind delete button click
    $("#example tbody")
      .off("click", ".btn-delete")
      .on("click", ".btn-delete", function () {
        const id = $(this).attr("data-id");
        console.log("Deleting vehicle ID:", id);
        handleDelete(id);
      });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
      $("#example tbody").off("click", ".btn-delete");
    };
  }, []);

  return (
    <>
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
            <span>Vehicle List</span>
            <a href="/Vehicle" className="addcity">
              Add Vehicle
            </a>
          </div>
          <div className="chckout-card">
            <div className="mt-4">
              <table
                ref={tableRef}
                id="example"
                className="display nowrap"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr>
                    <th>Sr.No</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Minimum Earning</th>
                    <th>Registration Fee</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Vehicle_list;
