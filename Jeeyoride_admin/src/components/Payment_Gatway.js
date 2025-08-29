import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import { BASE_URL } from './config';
import 'datatables.net';
import 'datatables.net-responsive';

const PaymentGateways = () => {
  const [gateways, setGateways] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const response = await fetch(`${BASE_URL}/payment_getway`);
        const data = await response.json();
        setGateways(data);
      } catch (error) {
        console.error('Failed to fetch payment gateways:', error);
      }
    };

    fetchGateways();
  }, []);

  return (
    <>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <Sidebar isActive={isActive} handleToggle={handleToggle} />
      <div id="page-container" className={isActive ? 'sidebar-open' : 'sidebar-closed'}>
        <div className="driver-card-body">
          <div className="chckout-card">
            <h4 className="">Payment Gateway List</h4>
            <div className="overflow-x-auto">
              <table id="example" className="display nowrap" cellSpacing="0"  width="100%" >
                <thead className="bg-gray-100">
                  <tr>
                    <th >ID</th>
                    <th>Title</th>
                    <th >Image</th>
                    <th >Status</th>
                    <th >Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gateways.length > 0 ? (
                    gateways.map((gateway) => (
                      <tr key={gateway.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{gateway.id}</td>
                        <td className="py-2 px-4 border">{gateway.title}</td>
                        <td className="py-2 px-4 border">
                          <img  src={gateway.image_url || '/placeholder.png'}
                            alt={gateway.title} className="w-16 h-16 object-contain"
                          />
                        </td>
                         <td className="py-2 px-4 border">
                          {gateway.status === 1 ? (
                            <span className="publish">Publish</span>
                          ) : (
                            <span className="Unpublish">Unpublish</span>
                          )}
                        </td>
                        <td>
                            <a href='/add_paymentgatway' ><i class="fa fa-edit"></i></a>
                            <a href=''><i class="fa fa-trash-o dicon" ></i></a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No gateways found.
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

export default PaymentGateways;
