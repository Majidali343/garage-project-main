import React, { useState, useEffect } from "react";
import Logo from "../Pages/images/logo.jpeg";
import Notification from "../Pages/images/Notification.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { saveAs } from "file-saver";
import Navigation from "./Navigation";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Modal from "../Modal";

function Employeetask() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [vehicles, setVehicles] = useState([null]); // Default value for vehicles
  const [descriptions, setDescriptions] = useState(); // Default value for descriptions
  const [dates, setDates] = useState([new Date()]); // Default date for the first row
  const [contacts, setContacts] = useState([null]); // Default value for contacts
  const [amounts, setAmounts] = useState([null]); // Default value for amounts
  const [names, setNames] = useState(); // State for names
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    vehicle: "",
    contact: "",
    location: ""
  });
  const [taskData, setTaskData] = useState([]);
  const [locations, setLocations] = useState([null]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [modalVehicles, setModalVehicles] = useState([]);
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [searchName, setSearchName] = useState("");
  const [selectedVehicles, setSelectedVehicles] = useState([]);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleDropdownChange = (value, index, type) => {
    switch (type) {
      case "vehicle":
        const newVehicles = [...vehicles];
        newVehicles[index] = value;
        setVehicles(newVehicles);
        break;
      case "amount":
        const newAmounts = [...amounts];
        newAmounts[index] = value;
        setAmounts(newAmounts);
        break;
      case "contact":
        const newContacts = [...contacts];
        newContacts[index] = value;
        setContacts(newContacts);
        break;
      default:
        break;
    }
    setDropdownOpen(null); // Close dropdown after selection
  };

  const handleDateChange = (date, index) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
  };

  const handleSubmit = async () => {
    const formData = {
      names,
      vehicles: selectedVehicles.join(', '),
      descriptions,
      dates,
      contacts,
      amounts,
      locations,
    };

    try {
      const result = await fetch(
        "http://77.37.49.209:5000/customer/post/E-customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      fetchData();

      // Optionally handle response or update state after successful POST
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://77.37.49.209:5000/customer/get/E-customer"
      );
      const data = await response.json();
      setTaskData(data.rows);
      setFilteredData(data.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [dateFilter, searchFilters]);

  const resetFilters = () => {
    setDateFilter({ start: "", end: "" });
    setSearchFilters({
      name: "",
      vehicle: "",
      contact: "",
      location: ""
    });
    setFilteredData(taskData);
  };

  const filterData = () => {
    let data = taskData;

    // Date filtering
    if (dateFilter.start && dateFilter.end) {
      data = data.filter(
        (invoice) =>
          invoice.date >= dateFilter.start && invoice.date <= dateFilter.end
      );
    }

    // Search filtering across multiple fields
    if (Object.values(searchFilters).some(filter => filter !== "")) {
      data = data.filter(item => {
        return (
          (!searchFilters.name || 
            item.name?.toLowerCase().includes(searchFilters.name.toLowerCase())) &&
          (!searchFilters.vehicle || 
            item.vehicle?.toLowerCase().includes(searchFilters.vehicle.toLowerCase())) 

        );
      });
    }

    setFilteredData(data);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    const vehicleArray = customer.vehicle ? customer.vehicle.split(', ') : [];
    setModalVehicles(vehicleArray);
    setFormData({
      ...customer,
      vehicle: vehicleArray
    });
    setEditModalOpen(true);
  };

  const handleDelete = (customer) => {
    setCurrentCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(
        `http://77.37.49.209:5000/customer/delete/${currentCustomer.id}`,
        {
          method: "DELETE",
        }
      );
      setDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //
  const handleSubmitChange = async (e) => {
    e.preventDefault();

    try {
      
      const submitData = {
        ...formData,
        vehicle: modalVehicles.join(', ') // Join vehicles array into string
      };

      await fetch(
        `http://77.37.49.209:5000/customer/update/${currentCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating customer data:", error);
    }
  };

  const handleModalVehicleChange = (vehicle) => {
    setModalVehicles(prevVehicles => {
      if (vehicle === "") {
        return [];
      }
      const newVehicles = prevVehicles.includes(vehicle)
        ? prevVehicles.filter(v => v !== vehicle)
        : [...prevVehicles, vehicle];
      
      // Update formData when vehicles change
      setFormData(prev => ({
        ...prev,
        vehicle: newVehicles.join(', ')
      }));
      
      return newVehicles;
    });
  };

  const vehicleOptions = [
    "",
    "Crane: 25-Ton",
    "Crane: 50-Ton",
    "Crane: 70-Ton",
    "Crane: 100-Ton",
    "Forklift: 3-Ton",
    "Forklift: 5-Ton",
    "Forklift: 7-Ton",
    "Forklift: 10-Ton",
    "Boomloader: 523",
    "Boomloader: 540",
  ];

  const handleVehicleChange = (vehicle) => {
    setSelectedVehicles((prevVehicles) => {
      if (vehicle === "") {
        return [];
      }
      if (prevVehicles.includes(vehicle)) {
        return prevVehicles.filter((v) => v !== vehicle);
      } else {
        return [...prevVehicles, vehicle];
      }
    });
    setDropdownOpen(null);
  };

  return (
    <div className="bg-gray-100 h-screen flex">
      <aside className="w-64 bg-white text-white flex-shrink-0 fixed h-full">
        <div className="p-6">
          <img className="w-24 h-24 text-white p-2" src={Logo} alt="Logo" />
          <Navigation />
        </div>
      </aside>
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow p-7 flex items-center">
          <h2 className="text-xl font-bold text-[#3d3d3d] flex-1">Customers</h2>
          {/* <div className="flex-1 flex justify-center ml-">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/1 px-3 py-1 border rounded shadow-sm text-xs"
            />
          </div> */}
          <div className="w-8 h-8 cursor-pointer hover:red-300">
            <img src={Notification} alt="icon" />
          </div>
          <button
            className="text-[#FFFF] bg-[#ea8732] ml-9 mr-9 border-0 py-1 px-2 w-28 focus:outline-none hover:bg-gray-200 rounded font-semibold text-sm"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </header>
        <div className="bg-white shadow p-10 flex items-center justify-center flex-wrap gap-4">
        <div className="filters flex flex-wrap gap-4">
          <input
            type="date"
            className="w-32 px-3 py-1 border rounded shadow-sm text-xs"
            value={dateFilter.start}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, start: e.target.value })
            }
            placeholder="Start Date"
          />
          <input
            type="date"
            className="w-32 px-3 py-1 border rounded shadow-sm text-xs"
            value={dateFilter.end}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, end: e.target.value })
            }
            placeholder="End Date"
          />
          <input
            type="text"
            className="w-32 px-3 py-1 border rounded shadow-sm text-xs"
            value={searchFilters.name}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Search Name"
          />
          <input
            type="text"
            className="w-32 px-3 py-1 border rounded shadow-sm text-xs"
            value={searchFilters.vehicle}
            onChange={(e) => setSearchFilters(prev => ({ ...prev, vehicle: e.target.value }))}
            placeholder="Search Vehicle"
          />
          <button
            onClick={resetFilters}
            className="bg-[#ea8732] text-white px-6 py-1 rounded-md"
          >
            Reset
          </button>
        </div>
      </div>
        <div className="flex-1 p-6 flex justify-center overflow-y-auto">
          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-left">
                    Name
                  </th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">
                    Vehicle
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Description
                  </th>
                  <th className="py-3 px-16 bg-gray-200 text-[#3d3d3d] text-center">
                    Date
                  </th>
                  <th className="py-3 px-8 bg-gray-200 text-[#3d3d3d] text-center">
                    Contact
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Location
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Amount
                  </th>
                  <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">
                    Action
                  </th>

                  {/* <th className="py-3 px-7 bg-gray-200 text-[#3d3d3d] text-center">Download data</th> */}
                </tr>
              </thead>
              <tbody>
                <tr className="text-[#3d3d3d] border-t">
                  <td className="py-3 px-4 text-left text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Name"
                      onChange={(e) => {
                        setNames(e.target.value);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <div className="relative inline-block">
                      <button
                        className="text-[#ea8732] bg-[#fef4eb] hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#ffd7b5] font-medium rounded-full text-xs px-4 py-1.5 inline-flex items-center"
                        type="button"
                        onClick={toggleDropdown}
                      >
                        {selectedVehicles.length
                          ? selectedVehicles.join(", ")
                          : "Choose Vehicle(s)"}
                        <svg
                          className="w-2.5 h-2.5 ml-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>
                      {dropdownOpen && (
                        <div className="absolute mt-2 w-full py-1 bg-white border border-gray-200 rounded shadow-md">
                          {vehicleOptions.map((option) => (
                            <label
                              key={option}
                              className="flex items-center px-4 py-2 hover:bg-gray-100"
                            >
                              <input
                                type="checkbox"
                                checked={selectedVehicles.includes(option)}
                                onChange={() => handleVehicleChange(option)}
                                className="mr-2"
                              />
                              {option || "None"}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-left text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Description"
                      onChange={(e) => {
                        setDescriptions(e.target.value);
                      }}
                    />
                  </td>
                  <td className="py-3 px-10 text-center text-xs">
                    <DatePicker
                      selected={dates[0]}
                      onChange={(date) => handleDateChange(date, 0)}
                      dateFormat="MM/dd/yyyy"
                      className="w-full py-1 px-2 border rounded"
                    />
                  </td>
                  <td className="py-3 px-4 text-left text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Contact"
                      value={contacts[0] || ""}
                      onChange={(e) =>
                        handleDropdownChange(e.target.value, 0, "contact")
                      }
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                    <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Location"
                      onChange={(e) => {
                        setLocations(e.target.value);
                      }}
                    />
                  </td>
                  <td className="py-3 px-4 text-center text-xs">
                  <input
                      type="text"
                      className="w-full py-1 px-2 border rounded"
                      placeholder="Enter Amount"
                      onChange={(e) => {
                        setAmounts(e.target.value, "amount");
                      }}
                    />
                  </td>
                </tr>

                {/* Render rows based on taskData */}
                {filteredData.map((customer, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs">
                      {customer.name}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {customer.vehicle}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {customer.description}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {customer.date}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {customer.contact}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {customer.location}
                    </td>
                    <td className="py-3 px-6 text-center text-xs">
                      {customer.amount}
                    </td>
                    <td className=" text-center text-xs">
                      <button
                        onClick={() => handleEdit(customer)}
                        // onClick={handleEdit(customer)}
                        className="text-blue-500  hover:text-blue-700"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer)}
                        className="text-black-500 hover:text-red-700 ml-2"
                      >
                        <MdDelete className="h-5 w-6" />
                      </button>
                    </td>

                    {/* <td className="py-3 px-6 text-center text-xs"> <button className='bg-[#ea8732] p-1 rounded-md text-white font-medium'   onClick={() => downloadExcel(customer.id)}>
      Download Excel
    </button></td> */}
                  </tr>
                ))}

                {/* Add 10 empty rows */}
                {[...Array(20)].map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-6 text-left text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                    <td className="py-3 px-6 text-center text-xs"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editModalOpen && (
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <div className="h-auto w-auto">
            <h2 className="text-lg font-bold">Edit Customer</h2>
            <form onSubmit={handleSubmitChange}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="mt-1 block p-2 h-8 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onClick={() => setModalDropdownOpen(!modalDropdownOpen)}
                >
                  {modalVehicles.length ? modalVehicles.join(', ') : 'Choose Vehicle(s)'}
                </button>
                {modalDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                    {vehicleOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={modalVehicles.includes(option)}
                          onChange={() => handleModalVehicleChange(option)}
                          className="mr-2"
                        />
                        <span className="text-sm">{option || 'None'}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="text"
                    name="amount"
                    required
                    value={formData.amount || ""}
                    onChange={handleChange}
                    className="mt-1 block h-8 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </Modal>
      )}

      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="text-lg font-bold">Confirm Delete</h2>
        <p>Are you sure you want to delete this customer?</p>
        <button
          onClick={handleConfirmDelete}
          className="bg-red-500 text-white py-2  px-4 rounded mt-4"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="bg-gray-500 text-white py-2 px-4 rounded mt-4 ml-2"
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default Employeetask;
