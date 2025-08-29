import React, { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "./config";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";

import "datatables.net";
import "datatables.net-responsive";
function Driver_Subscripation() {
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);

  const handleToggle = () => {
    setIsActive(!isActive);
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
        url: `${BASE_URL}/driver_subscripation_plan`,
        type: "GET",
        dataSrc: "", // FIX: use '' if your API returns a plain array
      },
      columns: [
        {
          data: null,
          render: (data, type, row, meta) =>
            meta.row + meta.settings._iDisplayStart + 1,
          orderable: false,
        },
        { data: "title" },
        { data: "days" },
        { data: "amount" },
        {
          data: null,
          orderable: false,
          render: function (data, type, row) {
            return `
              <a href="edit_subscripation?id=${row.plan_id}" class="view-btn" ><i class="fa fa-edit"></i></button>
            `;
          },
        },
      ],
    });
  }, []);

  return (
    <>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div
        id="page-container"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div className="driver-card-body">
          <div className="headercard">
            <span>Subscription List</span>
            <a href="/add_subscripation" className="addcity">
              Add Subscription
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
                    <th> Sr.No </th>
                    <th> Vehicle Type </th>
                    <th> Days </th>
                    <th> Amount </th>
                    <th> Action </th>
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

export default Driver_Subscripation;
