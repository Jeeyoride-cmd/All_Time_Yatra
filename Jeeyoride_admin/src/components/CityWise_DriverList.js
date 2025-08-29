import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";

import "datatables.net";
import "datatables.net-responsive";
import Sidebar from "./Sidebar"; // Assuming Sidebar is a local component
import { BASE_URL } from "./config"; // Adjust import if needed

export default function CityDriverWise_List() {
  const [isActive, setIsActive] = useState(true);
  const tableRef = useRef(null);

  const handleToggle = () => setIsActive(!isActive);

  useEffect(() => {
    const table = $(tableRef.current);

    // Destroy if already initialized
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    // Initialize DataTable
    table.DataTable({
      processing: true,
      responsive: true,
      ajax: {
        url: `${BASE_URL}/city_wise_list`,
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
        { data: "district_name" },
        {
          data: null,
          orderable: false,
          render: (data, type, row) => `
            <a href="driver_citywiselist?id=${row.id}" class="viewbtn"><i class="fa fa-user"></i></a>
          `,
        },
      ],
    });

    // Optional cleanup
    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
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
            <center>
              <h4>City List</h4>
            </center>
          </div>
          <div className="chckout-card mt-4">
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
                  <th>City</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
