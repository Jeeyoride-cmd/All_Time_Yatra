
import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import { BASE_URL } from './config';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-responsive';

function CanacalTrip_List() {
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
              url: `${BASE_URL}/cancal`,
              type: 'GET',
              dataSrc: '', // FIX: use '' if your API returns a plain array
            },
      columns: [
        {
          data: null,
          render: (data, type, row, meta) => meta.row + meta.settings._iDisplayStart + 1,
          orderable: false
        },
        { data: 'username' },
        { data: 'dusername' },
        { data: 'pickup_add' },
        { data: 'drop_add' },
        { data: 'amount' },
        { data: 'trip_status' },
        { data: 'payment_method' },
        { data: 'dt' },

      ],
      
    });
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css"/>
      <link rel="stylesheet"  href="https://cdn.datatables.net/responsive/2.4.1/css/responsive.dataTables.min.css"/>

      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="driver-card-body">
         <div class="headercard">
              <center><h4>Cancelled Trip List</h4></center>
          </div>
          <div className="chckout-card">
            <div className="mt-4">
              <table  ref={tableRef}  id="example" className="display nowrap"
                cellSpacing="0"  width="100%"  >
                <thead>
                  <tr>
                    <th> Sr.No </th>
                    <th> Customer Name </th>
                    <th> Driver ID </th>
                    <th> Pickup Address </th>
                    <th> Drop Address </th>
                    <th> Amount </th>
                    <th> Trip Status </th>
                    <th> Payment method </th>
                    <th> Date </th>
                
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

export default CanacalTrip_List;
