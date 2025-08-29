import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import useUserRole from "./useUserRole";

function User_List() {
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);
  const userrole = useUserRole();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Expose updateDistrictStatus globally for inline DataTable button use
  useEffect(() => {
    window.updateDistrictStatus = function (id, newStatus) {
      if (window.confirm("Are you sure you want to change the status?")) {
        fetch(`${BASE_URL}/user_update_status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status: newStatus }),
        })
          .then((res) => res.json())
          .then((data) => {
            alert(data.message);
            $("#example").DataTable().ajax.reload(null, false); // Reload table data
          })
          .catch((err) => {
            alert("Error updating status");
            console.error(err);
          });
      }
    };
  }, []);

  useEffect(() => {
    if (userrole === null) return; // Wait until userrole is available

    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    table.DataTable({
      processing: true,
      responsive: true,
      ajax: {
        url: `${BASE_URL}/user_info`,
        type: "GET",
        dataSrc: "", // API returns array
      },
      columns: [
        {
          data: null,
          render: (data, type, row, meta) =>
            meta.row + meta.settings._iDisplayStart + 1,
          orderable: false,
        },
        { data: "username" },
        {
          data: null,
          render: (data, type, row) => `
            <b>Name:</b> ${row.user_full_name || "-"}<br/>
            <b>Mobile:</b> ${row.user_mobile || "-"}<br/>
            <b>Email:</b> ${row.user_email || "-"}<br/>
            <b>Address:</b> ${row.user_permanent_address || "-"}
          `,
        },
        {
          data: "image",
          render: (data) =>
            data
              ? `<img src="${data}" alt="image" style="width:50px; height:50px; object-fit:cover;" />`
              : "No Image",
        },
        {
          data: "user_register_at",
          render: (data) => {
            return data ? data.split("T")[0] : "";
          },
        },
        {
          data: "status",
          render: function (data, type, row) {
            const isActive = data == 1;
            const newStatus = isActive ? 0 : 1;
            const btnClass = isActive ? "btn-success" : "btn-danger";
            const btnText = isActive ? "Active" : "In-active";
            if (userrole === 1 || userrole === 2 || userrole === 3) {
              return `<button class="btn ${btnClass}" onclick="updateDistrictStatus('${row.id}', ${newStatus})">${btnText}</button>`;
            } else {
              return `<span class="badge ${btnClass}">${btnText}</span>`;
            }
          },
        },
        {
          data: "approved",
          render: (data) => {
            if (data > 0)
              return '<span style="color:green;"><b>Approved</b></span>';
            if (data < 0)
              return '<span style="color:red;"><b>Rejected</b></span>';
            return '<span style="color:orange;"><b>Pending</b></span>';
          },
        },
      ],
    });
  }, [userrole]);
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

      <Sidebar isActive={isActive} handleToggle={handleToggle} />

      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="driver-card-body">
          <div className="title-card">
            <div className="headercard">
              <center>
                <h4>User List</h4>
              </center>
            </div>
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
                    <th>User Name</th>
                    <th>User Info</th>
                    <th>Profile Image</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Details Status</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User_List;
