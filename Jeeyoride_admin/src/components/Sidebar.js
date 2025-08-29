import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo/admin_logo.jpeg";
import "./css/sidebar.css";
import { Sun, Moon } from "lucide-react";

import useUserRole from "./useUserRole";

function Sidebar({ isActive, handleToggle }) {
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);
  const userrole = useUserRole();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const path = window.location.pathname;
  const segment = path.split("/").pop();

  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(() => {
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      sessionStorage.setItem("visited", "true");
      return false;
    }
    const savedState = sessionStorage.getItem("dropdownState");
    return savedState === "true";
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => {
      const newState = !prevState;
      sessionStorage.setItem("dropdownState", newState);
      return newState;
    });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".item1") && !e.target.closest(".sub-menu1")) {
        setIsDropdownOpen(false);
        sessionStorage.setItem("dropdownState", "false");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handlePathChange = () => setActivePath(window.location.pathname);
    window.addEventListener("popstate", handlePathChange);
    return () => window.removeEventListener("popstate", handlePathChange);
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <div
        id="sidebar"
        className={`${isActive ? "sidebar-open" : "sidebar-closed"} ${theme}`}
      >
        <nav>
          <div className="logoconent">
            <Link to="/">
              <img
                src={logo}
                alt="logo"
                width={"50px"}
                height={"50px"}
                className="sidebarlogo"
              />
            </Link>
          </div>
          <hr />

          <ul>
            <li className={activePath === "/dashboard" ? "active-link" : ""}>
              <Link to="/dashboard" onClick={() => setActivePath("/dashboard")}>
                <span className="icon">
                  <i className="fas fa-donate"></i>
                </span>
                <span className="title">Dashboard</span>
              </Link>
            </li>

            {(userrole === 1 || userrole === 5) && (
              <>
                <li className={activePath === "/driver" ? "active-link" : ""}>
                  <Link to="/driver" onClick={() => setActivePath("/driver")}>
                    <span className="icon">
                      <i className="fas fa-donate"></i>
                    </span>
                    <span className="title">Driver List</span>
                  </Link>
                </li>

                <li
                  className={activePath === "/user_list" ? "active-link" : ""}
                >
                  <Link
                    to="/user_list"
                    onClick={() => setActivePath("/user_list")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">User List</span>
                  </Link>
                </li>
              </>
            )}
            {userrole === 1 ||
              (userrole === 5 && (
                <>
                  <li className="item1 dropdowndesktopview">
                    <div className="sub-btn1" onClick={toggleDropdown}>
                      <span className="icon1">
                        <i className="fas fa-edit"></i>
                      </span>
                      <span className="title1">Trip List</span>
                      <i
                        className={`fas fa-angle-right dropdown ${
                          isDropdownOpen ? "rotate" : ""
                        }`}
                      ></i>
                    </div>
                    <ul
                      ref={dropdownRef}
                      className={`sub-menu1 ${isDropdownOpen ? "show1" : ""}`}
                    >
                      <li
                        style={{
                          color: segment === "pending_trips" ? "#0dcaf0" : "",
                        }}
                      >
                        <Link to="/pending_trips">Pending Trips</Link>
                      </li>
                      <li
                        style={{
                          color: segment === "accept_trips" ? "#0dcaf0" : "",
                        }}
                      >
                        <Link to="/accept_trips">Accepted Trips</Link>
                      </li>
                      <li
                        style={{
                          color: segment === "start_trips" ? "#0dcaf0" : "",
                        }}
                      >
                        <Link to="/start_trips">Start Trips</Link>
                      </li>
                      <li
                        style={{
                          color: segment === "completed_trips" ? "#0dcaf0" : "",
                        }}
                      >
                        <Link to="/completed_trips">Completed Trips</Link>
                      </li>
                      <li
                        style={{
                          color: segment === "cancal_trips" ? "#0dcaf0" : "",
                        }}
                      >
                        <Link to="/cancal_trips">Cancel Trips</Link>
                      </li>
                    </ul>
                  </li>
                </>
              ))}

            {userrole === 1 && (
              <>
                <li className="item1 dropdowndesktopview">
                  <div className="sub-btn1" onClick={toggleDropdown}>
                    <span className="icon1">
                      <i className="fas fa-edit"></i>
                    </span>
                    <span className="title1">Trip List</span>
                    <i
                      className={`fas fa-angle-right dropdown ${
                        isDropdownOpen ? "rotate" : ""
                      }`}
                    ></i>
                  </div>
                  <ul
                    ref={dropdownRef}
                    className={`sub-menu1 ${isDropdownOpen ? "show1" : ""}`}
                  >
                    <li
                      style={{
                        color: segment === "pending_trips" ? "#0dcaf0" : "",
                      }}
                    >
                      <Link to="/pending_trips">Pending Trips</Link>
                    </li>
                    <li
                      style={{
                        color: segment === "accept_trips" ? "#0dcaf0" : "",
                      }}
                    >
                      <Link to="/accept_trips">Accepted Trips</Link>
                    </li>
                    <li
                      style={{
                        color: segment === "start_trips" ? "#0dcaf0" : "",
                      }}
                    >
                      <Link to="/start_trips">Start Trips</Link>
                    </li>
                    <li
                      style={{
                        color: segment === "completed_trips" ? "#0dcaf0" : "",
                      }}
                    >
                      <Link to="/completed_trips">Completed Trips</Link>
                    </li>
                    <li
                      style={{
                        color: segment === "cancal_trips" ? "#0dcaf0" : "",
                      }}
                    >
                      <Link to="/cancal_trips">Cancel Trips</Link>
                    </li>
                  </ul>
                </li>

                <li
                  className={
                    activePath === "/city_wise_driver_list" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/city_wise_driver_list"
                    onClick={() => setActivePath("/city_wise_driver_list")}
                  >
                    <span className="icon">
                      <i className="far fa-file-alt"></i>
                    </span>
                    <span className="title">City Wise Driver List</span>
                  </Link>
                </li>

                <li
                  className={
                    activePath === "/driver_subscripation" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/driver_subscripation"
                    onClick={() => setActivePath("/driver_subscripation")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Driver Subscription</span>
                  </Link>
                </li>

                <li
                  className={
                    activePath === "/driver_transaction" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/driver_transaction"
                    onClick={() => setActivePath("/driver_transaction")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Subscription Transaction</span>
                  </Link>
                </li>

                <li
                  className={
                    activePath === "/vehicle_list" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/vehicle_list"
                    onClick={() => setActivePath("/vehicle_list")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Vehicle List</span>
                  </Link>
                </li>

                <li
                  className={activePath === "/fares_list" ? "active-link" : ""}
                >
                  <Link
                    to="/fares_list"
                    onClick={() => setActivePath("/fares_list")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Fares</span>
                  </Link>
                </li>

                <li
                  className={
                    activePath === "/list_notification" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/list_notification"
                    onClick={() => setActivePath("/list_notification")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Notification</span>
                  </Link>
                </li>

                <li
                  className={activePath === "/city_list" ? "active-link" : ""}
                >
                  <Link
                    to="/city_list"
                    onClick={() => setActivePath("/city_list")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">City List</span>
                  </Link>
                </li>

                <li
                  className={
                    activePath === "/site_setting" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/site_setting"
                    onClick={() => setActivePath("/site_setting")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Site Setting</span>
                  </Link>
                </li>

                <li className={activePath === "/ads_list" ? "active-link" : ""}>
                  <Link
                    to="/ads_list"
                    onClick={() => setActivePath("/ads_list")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Ads List</span>
                  </Link>
                </li>

                <li
                  className={
                    activePath === "/list_franchise" ? "active-link" : ""
                  }
                >
                  <Link
                    to="/list_franchise"
                    onClick={() => setActivePath("/list_franchise")}
                  >
                    <span className="icon">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="title">Franchise</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div
        id="main-content"
        className={isActive ? "sidebar-open" : "sidebar-closed"}
      >
        <div id="header">
          <div
            className="activelabel"
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <Link onClick={logout} style={{ cursor: "pointer" }}>
              <span className="signout">
                <i className="fas fa-sign-out-alt"></i>
              </span>
            </Link>

            <div
              className="toggle1"
              onClick={handleToggle}
              style={{ color: "#94a3b8", width: "100px", cursor: "pointer" }}
            >
              <span className="icon">
                <i className="fas fa-bars"></i>
              </span>
            </div>

            <button
              onClick={toggleTheme}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "transparent",
                color: theme === "light" ? "#fff" : "red",
                width: "70px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
