import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import $ from "jquery";
import "datatables.net";
import "datatables.net-responsive";
import { useLocation } from "react-router-dom";

function CitySeparate_DriverList() {
  const [isActive, setIsActive] = useState(true);
  const [showModal, setModel] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const tableRef = useRef(null);
  const query = new URLSearchParams(useLocation().search);
  const cid = query.get("id");

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
  useEffect(() => {
    const table = $(tableRef.current);
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    table.DataTable({
      processing: true,
      responsive: true,
      ajax: {
        url: `${BASE_URL}/city_wise_Driver_list?id=${cid}`,
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
        { data: "id" },
        {
          data: "driver_availability",
          render: function (data) {
            if (data === 1)
              return '<span style="color:orange;"><b>Enable</b></span>';
            if (data === 0)
              return '<span style="color:red;"><b>Disable</b></span>';
            return '<span style="color:gray;"><b>Unknown</b></span>';
          },
        },
        {
          data: "vehicle_type_registration_fee",
          render: (fee) =>
            fee
              ? `<span><b>${fee} ₹</b></span>`
              : '<span style="color:gray;">N/A</span>',
        },
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

            if (plan_expire_status == 0)
              return '<span style="color:green;"><b>Inactive</b></span>';
            if (plan_expire_status == 1)
              return `<span style="color:red;"><b>Active</b><br/> (${remainingDays} Days Remaining)</span>`;
            return '<span style="color:gray;"><b>Unknown</b></span>';
          },
        },
        { data: "username" },
        {
          data: null,
          render: (data, type, row) => `
            <br/><b>Name:</b> ${row.driver_full_name || "N/A"}<br/>
            <b>Mobile:</b> ${row.driver_mobile || "N/A"}<br/>
            <b>Address:</b> ${row.driver_address || "N/A"}
          `,
        },
        { data: "balance" },
        {
          data: "driver_photo",
          render: (data) =>
            data
              ? `<img src="${data}" alt="image" style="width:50px; height:50px; object-fit:cover;" />`
              : "No Image",
        },
        { data: "created_at" },
        {
          data: "driver_active_status",
          render: function (data, type, row) {
            const isActive = data == 1;
            const newStatus = isActive ? 0 : 1;
            const btnClass = isActive ? "btn-success" : "btn-danger";
            const btnText = isActive ? "Active" : "In-active";

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
          data: null,
          orderable: false,
          render: (data, type, row) => `
            <a href="/sendNotification?did=${row.id}" class="btn-icon" title="Send Notification">
              <i class="fa fa-bell" aria-hidden="true"></i>
            </a>
             <a href="#" class="btn-icon2 view-details" title="iew Details" data-id="${row.id}">
              <i class="fa fa-eye"></i>
            </a>
            <a href="#" class="btn-icon2 Subscription Details" title="Subscription Details" data-id="${row.id}">
              <i class="fa fa-cc"></i>
            </a>
          `,
        },
      ],
    });

    // jQuery event for "view-details" button
    $(document).on("click", ".view-details", function (e) {
      e.preventDefault();
      const row = $("#example").DataTable().row($(this).parents("tr")).data();
      setSelectedDriverId(row);
      setModel(true);
    });
    // Cleanup on unmount
    return () => {
      $(document).off("click", ".view-details");
    };
  }, [cid]);

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
          <div className="title-card">
            <div class="headercard">
              <center>
                <h4>Driver City Wise List</h4>
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
                    <th>Driver Id</th>
                    <th>
                      Driver <br />
                      Availability
                    </th>
                    <th>
                      Registration
                      <br /> Fee
                    </th>
                    <th>
                      Registration <br />
                      Fee Status
                    </th>
                    <th>
                      Subscription <br /> Status{" "}
                    </th>
                    <th>User Name</th>
                    <th>
                      Driver Info
                      <br />
                    </th>
                    <th>Wallet Amt </th>
                    <th>Profile Image</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Details Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showModal && selectedDriverId && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h4 className="popuptitle">Driver All Details</h4>
            <button style={styles.closeButton} onClick={() => setModel(false)}>
              ×
            </button>
            <table
              className="display nowrap popuptable"
              cellSpacing="0"
              width="100%"
            >
              <tr>
                <th>Driver ID</th>
                <td>{selectedDriverId.id}</td>
              </tr>
              <tr>
                <th>Vehicle Type</th>
                <td>{selectedDriverId.vehicle_type}</td>
              </tr>
              <tr>
                <th>Vehicle Number</th>
                <td>{selectedDriverId.vehicle_no}</td>
              </tr>
              <tr>
                <th>Vehicle Model</th>
                <td>{selectedDriverId.vehicle_model}</td>
              </tr>
              <tr>
                <th>Rider Type</th>
                <td>{selectedDriverId.rider_type}</td>
              </tr>
              <tr>
                <th>Vehicle Image</th>
                <td>
                  <img src={selectedDriverId.vehicle_image} alt="image" />
                </td>
              </tr>
              <tr>
                <th>Driving Licence</th>
                <td>
                  <img src={selectedDriverId.driving_license} alt="image" />
                </td>
              </tr>
              <tr>
                <th>Insurance Copy</th>
                <td>
                  <img src={selectedDriverId.insurance_copy} alt="image" />
                </td>
              </tr>
              <tr>
                <th>RC</th>
                <td>
                  <img src={selectedDriverId.upload_rc} alt="image" />
                </td>
              </tr>
            </table>

            <from>
              <textarea placeholder="Enter Reject Message"></textarea>
              <button className="btn btn-info popsubmitbtn">Submit</button>
            </from>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#94a3b8",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    position: "relative",
    width: "500px",
    maxHeight: "100vh", // Set maximum height to 90% of viewport height
    overflowY: "auto", // Enable vertical scrolling
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    // Hide scrollbar visually (still scrollable)
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE and Edge
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "25px",
    cursor: "pointer",
    color: "black",
  },
  icon: {
    marginBottom: "10px",
  },
  title: {
    fontSize: "18px",
    color: "black",
  },
};

export default CitySeparate_DriverList;
