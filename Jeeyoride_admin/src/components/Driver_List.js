import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import useUserRole from "./useUserRole";

function Driver_List() {
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);
  const userrole = useUserRole();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  // Expose updateDistrictStatus globally for inline DataTable button use
  useEffect(() => {
    window.updateDistrictStatus = function (id, newStatus, isActive) {
      const actionText = isActive ? "inactivate" : "activate";
      if (
        window.confirm(`Are you sure you want to ${actionText} this driver?`)
      ) {
        fetch(`${BASE_URL}/driver_update_status`, {
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

  // useEffect(() => {
  //   const table = $(tableRef.current);
  //   if ($.fn.DataTable.isDataTable(table)) {
  //     table.DataTable().destroy();
  //   }

  //   table.DataTable({
  //     processing: true,
  //     responsive: true,
  //     ajax: {
  //       url: `${BASE_URL}/driver_info`,
  //       type: "GET",
  //       dataSrc: "", // FIX: use '' if your API returns a plain array
  //     },
  //     columns: [
  //       {
  //         data: null,
  //         render: (data, type, row, meta) =>
  //           meta.row + meta.settings._iDisplayStart + 1,
  //         orderable: false,
  //       },
  //       { data: "id" },
  //       {
  //         data: null,
  //         render: (data, type, row) => `
  //           <br/><b>Name:</b> ${row.driver_full_name || "N/A"}<br/>
  //           <b>Mobile:</b> ${row.driver_mobile || "N/A"}<br/>
  //           <b>Email:</b> ${row.driver_email || "-"}<br/>
  //           <b>City:</b> ${row.cityname || "N/A"}<br/>
  //           <b>Registration Date:</b> ${row.created_at || "N/A"}
  //         `,
  //       },
  //       { data: "vehicle_type_registration_fee" },
  //       {
  //         data: "registeration_fee_status",
  //         render: (data) => {
  //           if (data === 1)
  //             return '<span style="color:green;"><b>Payment Received</b></span>';
  //           if (data === 0)
  //             return '<span style="color:red;"><b>Unpaid</b></span>';
  //           return '<span style="color:gray;"><b>Unknown</b></span>';
  //         },
  //       },
  //       {
  //         data: null,
  //         render: (data, type, row) => {
  //           const planDate = new Date(row.plan_date);
  //           const validityDays = parseInt(row.days);
  //           const plan_expire_status = row.plan_expire_status;
  //           const expiryDate = new Date(planDate);
  //           expiryDate.setDate(expiryDate.getDate() + validityDays);
  //           const currentDate = new Date();
  //           const timeDiff = expiryDate - currentDate;
  //           const remainingDays =
  //             timeDiff > 0 ? Math.floor(timeDiff / (1000 * 60 * 60 * 24)) : 0;

  //           if (plan_expire_status === 0)
  //             return '<span style="color:green;"><b>Inactive</b></span>';
  //           if (plan_expire_status === 1)
  //             return `<span style="color:red;"><b>Active</b><br/> (${remainingDays} Days Remaining)</span>`;
  //           return '<span style="color:gray;"><b>Unknown</b></span>';
  //         },
  //       },
  //       { data: "username" },
  //       { data: "driver_address" },
  //       { data: "balance" },
  //       {
  //         data: "driver_active_status",
  //         render: function (data, type, row) {
  //           const isActive = data == 1;
  //           const newStatus = isActive ? 0 : 1;
  //           const btnClass = isActive ? "btn-success" : "btn-danger";
  //           const btnText = isActive ? "Active" : "In-active";

  //           return `<button class="btn ${btnClass}" onclick="updateDistrictStatus('${row.id}', ${newStatus}, ${isActive})">${btnText}</button>`;
  //         },
  //       },

  //       {
  //         data: "approved",
  //         render: (data) => {
  //           if (data > 0)
  //             return '<span style="color:green;"><b>Approved</b></span>';
  //           if (data < 0)
  //             return '<span style="color:red;"><b>Rejected</b></span>';
  //           return '<span style="color:orange;"><b>Pending</b></span>';
  //         },
  //       },
  //       {
  //         data: "driver_photo",
  //         render: (data) =>
  //           data
  //             ? `<img src="${data}" alt="image" style="width:50px; height:50px; object-fit:cover;" />`
  //             : "No Image",
  //       },
  //     ],
  //   });
  // }, []);

  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    table.DataTable({
      processing: true,
      responsive: true,
      ajax: {
        url: `${BASE_URL}/driver_info`,
        type: "GET",
        data: function (d) {
          if (userrole === 5) {
            const cityname = localStorage.getItem("cityname");
            d.cityname = cityname;
          }
        },
        dataSrc: "",
      },
      columns: [
        {
          data: null,
          render: (data, type, row, meta) =>
            meta.row + meta.settings._iDisplayStart + 1,
          orderable: false,
        },
        { data: "id" },
        {
          data: null,
          render: (data, type, row) => `
          <br/><b>Name:</b> ${row.driver_full_name || "N/A"}<br/>
          <b>Mobile:</b> ${row.driver_mobile || "N/A"}<br/>
          <b>Email:</b> ${row.driver_email || "-"}<br/>
          <b>City:</b> ${row.cityname || "N/A"}<br/>
          <b>Registration Date:</b> ${row.created_at || "N/A"}
        `,
        },
        { data: "vehicle_type_registration_fee" },
        {
          data: "registeration_fee_status",
          render: (data) => {
            if (data === 1)
              return '<span style="color:green;"><b>Payment Received</b></span>';
            if (data === 0)
              return '<span style="color:red;"><b>Unpaid</b></span>';
            return '<span style="color:gray;"><b>Unknown</b></span>';
          },
        },
        {
          data: null,
          render: (data, type, row) => {
            const planDate = new Date(row.plan_date);
            const validityDays = parseInt(row.days);
            const plan_expire_status = row.plan_expire_status;
            const expiryDate = new Date(planDate);
            expiryDate.setDate(expiryDate.getDate() + validityDays);
            const currentDate = new Date();
            const timeDiff = expiryDate - currentDate;
            const remainingDays =
              timeDiff > 0 ? Math.floor(timeDiff / (1000 * 60 * 60 * 24)) : 0;

            if (plan_expire_status === 0)
              return '<span style="color:green;"><b>Inactive</b></span>';
            if (plan_expire_status === 1)
              return `<span style="color:red;"><b>Active</b><br/> (${remainingDays} Days Remaining)</span>`;
            return '<span style="color:gray;"><b>Unknown</b></span>';
          },
        },
        { data: "username" },
        { data: "driver_address" },
        { data: "balance" },
        {
          data: "driver_active_status",
          render: function (data, type, row) {
            const isActive = data == 1;
            const newStatus = isActive ? 0 : 1;
            const btnClass = isActive ? "btn-success" : "btn-danger";
            const btnText = isActive ? "Active" : "In-active";

            // ✅ Hide the button for userrole 5
            if (userrole === 5) {
              return '<span style="color:gray;">Restricted</span>';
            }

            return `<button class="btn ${btnClass}" onclick="updateDistrictStatus('${row.id}', ${newStatus}, ${isActive})">${btnText}</button>`;
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
        {
          data: "driver_photo",
          render: (data) =>
            data
              ? `<img src="${data}" alt="image" style="width:50px; height:50px; object-fit:cover;" />`
              : "No Image",
        },
      ],
    });
  }, [userrole]); // dependency added to re-initialize on role change

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
            <div class="headercard">
              <center>
                <h4>Driver List</h4>
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
                    <th id="th">Sr.No</th>
                    <th>Driver Id</th>
                    <th>Driver Info</th>
                    <th>
                      Registration <br />
                      Fee Status
                    </th>
                    <th>
                      Subscription <br /> Status
                    </th>
                    <th>Paid</th>
                    <th>User Name</th>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Details Status</th>
                    <th>Profile Image</th>
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

export default Driver_List;
