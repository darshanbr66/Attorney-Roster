import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import "./EmployeeDashboard.css"; 
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const userId = location.state?.userId;

  const [filter, setFilter] = useState("");
  const [editedUsers, setEditedUsers] = useState({});
  const [newUser, setNewUser] = useState({ name: "", addressLine1: "", addressLine2: "" });
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const updating = () => {
    setLoading(!loading);
    if(loading){
      alert('Data edited succesfully')
    }
  };

  const updatingSaveButton = () => {
    
      alert('Data saved succesfully')
   
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  const API_URL = process.env.REACT_APP_API_URL;
  const fetchUsers = () => {
    const userId = location.state.userId; // Assuming you're using React Router's location.state
    console.log("UserId being sent to backend:", userId);
  
    axios
    .get(`${API_URL}/api/fetch-users?userId=${userId}`)
      // .get(`http://localhost:3000/api/fetch-users?userId=${userId}`)
      .then((response) => {
        console.log("Response from backend:", response.data);
        setUsers(response.data.data); // Assuming 'data' contains the fetched data
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };
  
  

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleEdit = (id, field, value) => {
    setEditedUsers({
      ...editedUsers,
      [id]: {
        ...editedUsers[id],
        [field]: value,
      },
    });
  };

  const handleUpdateAll = () => {
    const updates = Object.keys(editedUsers).map((id) => ({   //Object.keys() is a JavaScript method that takes an object and returns an array containing all the keys (or property names) of that object.
      slNo: parseInt(id),  
      ...editedUsers[id],
    }));

    axios
    
    .put('http://localhost:3000/api/update-users', updates)
      // .put(`${process.env.REACT_APP_API_URL}/api/update-users`, update)
      .then((response) => {
        console.log(response.data.message);
        setUsers(response.data.data);
        setEditedUsers({});
      })
      .catch((error) => console.error("Error updating users:", error));
  };

  const handleNewUserChange = (field, value) => {
  setNewUser({
  ...newUser,
  [field]: value,
  });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.addressLine1) {
      alert("Please fill all required fields.");
      return;
    }
  
    console.log("Adding user:", newUser);

  axios
  
  .post('http://localhost:3000/api/add-user', newUser)
  // .post(`${process.env.REACT_APP_API_URL}/api/add-user`, newUser)
  .then((response) => {
  console.log(response.data.message);
  fetchUsers();
  setNewUser({ 
        slNo: "",
        name: "", 
        addressLine1: "", 
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        phoneNumber: "",
        regCode: "",
        agentAttorney: "",
        dateOfPatent: "",
        agentLicensed: "",
        firmOrOrganization: "",
        updatedPhoneNumber: "",
        emailAddress: "",
        updatedOrganization: "",
        firmUrl: "",
        updatedAddress: "",
        updatedCity: "",
        updatedState: "",
        updatedCountry: "",
        updatedZipcode: "",
        linkedInProfile: "",
        notes: "",
        initials: "",
        dataUpdatedAsOn: ""
   });
  })
  .catch((error) => {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    });
  };
  
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked); 
    setUsers(users.map((user) => ({ ...user, isChecked }))); 
  };
  
  const handleCheckboxChange = (id, isChecked) => {
    setUsers(users.map((user) => (user.slNo === id ? { ...user, isChecked } : user)));
    
    const allSelected = users.every((user) => user.slNo === id ? isChecked : user.isChecked);
    setSelectAll(allSelected);
  };
   const handleDownload = () => {
    if (downloadFormat === "xlsx") {
      downloadAsExcel();
    } else if (downloadFormat === "pdf") {
      downloadAsPDF();
    } else {
      alert("Please select a format to download!");
    }
  };

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a3');
  
    // Extract table columns and rows
    const tableColumn = Object.keys(users[0]);
    const tableRows = users.map(user => Object.values(user));
  
    // AutoTable configuration
    doc.autoTable({
      margin: { top: 3, right: 3, bottom: 3, left: 3 }, // Reduce the outer margin
      head: [tableColumn],
      body: tableRows,
      theme: 'grid', // Ensures a grid layout with borders
      styles: {
        fontSize: 4,
        cellPadding: 0.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: 255, // Header text color
        fontSize: 5,
        lineWidth: 0.1, // Enforces border line width
        lineColor: [200, 200, 200], // Light gray borders
      },
      drawCell: (data) => {
        // Custom logic for rendering header borders
        if (data.section === 'head') {
          doc.setDrawColor(200, 200, 200); // Light gray border color
          doc.setLineWidth(0.1); // Border thickness
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
        }
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Reduce width for _id
        1: { cellWidth: 6 }, // Reduce width for slNo
        // Adjust or add more columns if needed
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });
  
    doc.save("users_with_reduced_margins.pdf");
  };
 
const showNMessage = () => {
  alert('Not Permited');
  // return showNMessage;
}

const navigate = useNavigate();
  function gohome(){
    navigate('/');
  }
  return (
    <div>
      <header className="header12">
        <h2 onClick={gohome}>Si<strong>g</strong>vitas</h2>
      </header>

     <main className="main3">
     <div className="user-table-container">
      
      <div className='Filter-Block'>
        <div className="Filter-Block1"> 
          <h2 className="title">User Management</h2>
        </div>
        <div className="Filter-Block2">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter}
          onChange={handleFilterChange}
          className="filter-input"
          // style={{width:'7009px'}}
        />
        <div>
      <select
        value={downloadFormat}
        onChange={(e) => setDownloadFormat(e.target.value)}
        className="download-format-dropdown"
      >
        <option value="" disabled>
          Select Format
        </option>
        <option value="xlsx">Excel</option>
        <option value="pdf">PDF</option>
      </select>
      <button onClick={handleDownload} className="Download-button">
        Download
      </button>
      
    </div>
    <button onClick={handleUpdateAll}>
    Save
  </button>
        </div>
      </div>
    <div
  style={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
   
  }}
>
  
  
    </div>
      <table className="user-table">
        <thead>
          <tr>
            {/* <th>Sl No</th>
            <th>Name</th>
            <th>Address Line 1</th>
            <th>Address Line 2</th> */}

            <th>Sl No</th>
            <th>Name</th>
            <th>Organization/Law Firm Name</th>
            <th>Address Line 1</th>
            <th>Address Line 2</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Zipcode</th>
            <th>Phone Number</th>
            <th>Reg Code </th>
            <th>Agent/Attorney</th>
            <th>Date of Patent</th>
            <th>Agent Licensed</th>
            <th>Firm or Organization</th>
            <th>Email Address</th>
            <th>Updated Phone Number</th>
            <th>Updated Organization/Law Firm Name</th>
            <th>Firm/Organization URL</th>
            <th>Updated Address</th>
            <th>Updated City</th>
            <th>Updated State</th>
            <th>Updated Country</th>
            <th>Updated Zipcode</th>
            <th>LinkedIn Profile URL</th>
            <th>Notes</th>
            <th>Initials</th>
            <th>Data Updated as on</th>
            <th style={{whiteSpace: 'wrap'}}>
             All{" "}
              <input
                style={{ width: "auto" }}
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>

            <th>EditingSaveField</th>

          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.name.toLowerCase().includes(filter.toLowerCase()))
            .map((user) => (
              <tr >
                <td>{user.slNo}</td>
                  <td>
                  <input
                    type="text"
                    defaultValue={user.name}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.organization}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.addressLine1}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.addressLine2}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.city}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.state}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.country}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.zipcode}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.phoneNumber}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.regCode}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.agentAttorney}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.dateOfPatent}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.agentLicensed}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.firmOrOrganization}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.emailAddress}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedPhoneNumber}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedOrganization}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.firmUrl}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedAddress}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedCity}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedState}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedCountry}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.updatedZipcode}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.linkedInProfile}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.notes}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                <td>
                  <input
                    type="text"
                    defaultValue={user.initials}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
                  <td>
                  <input
                    type="text"
                    defaultValue={user.dataUpdatedAsOn}
                    onChange={(e) => {
                      handleEdit(user.slNo, "name", e.target.value);
                      
                    }}
                    className="editable-input"
                  />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.isChecked || false} 
                  onChange={(e) => handleCheckboxChange(user.slNo, e.target.checked)}
                  style={{width:'auto'}}
                />
              </td>

              <td style={{width:'auto'}}>
                <button style={{width:'auto',cursor: 'pointer',fontSize: '10px',padding:'7px', margin: '0'}} onClick={updating}>{loading ? 'edited?' : 'edit'}</button>
                <button style={{width:'auto', cursor: 'pointer',fontSize: '10px',padding:'7px', margin: '2px'}} onClick={updatingSaveButton}>save</button>
                <button onClick={showNMessage} className={'dltBtn'} 
                 style={{
                  width:'auto',
                  // background: isHovered ? 'darkred' : 'red',
                  background: 'red',
                  color: 'white',
                  cursor: 'pointer', 
                  fontSize: '10px',
                  padding:'7px',
                  margin: '0'
                 }}
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}
                 >delete</button>
              </td>
                
              </tr>
            ))}
        </tbody>
      </table>

      
      <div className="add-user-form">
        <h3>Add New User</h3>
        <table class='user-table2'>
          <tr>
          <td>
                  <input
                  type="text"
                  placeholder="Sl. No"
                  value={newUser.slNo}
                  onChange={(e) => handleNewUserChange("slNo", e.target.value)}
                  className="add-user-input"
                  />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) => handleNewUserChange("name", e.target.value)}
                  className="add-user-input"
                  />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="Address Line 1"
                  value={newUser.addressLine1}
                  onChange={(e) => handleNewUserChange("addressLine1", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="Address Line 2"
                  value={newUser.addressLine2}
                  onChange={(e) => handleNewUserChange("addressLine2", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="city"
                  value={newUser.city}
                  onChange={(e) => handleNewUserChange("city", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="state"
                  value={newUser.state}
                  onChange={(e) => handleNewUserChange("state", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="country"
                  value={newUser.country}
                  onChange={(e) => handleNewUserChange("country", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="zipcode"
                  value={newUser.zipcode}
                  onChange={(e) => handleNewUserChange("zipcode", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="phoneNumber"
                  value={newUser.phoneNumber}
                  onChange={(e) => handleNewUserChange("phoneNumber", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="regCode"
                  value={newUser.regCode}
                  onChange={(e) => handleNewUserChange("regCode", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="agentAttorney"
                  value={newUser.agentAttorney}
                  onChange={(e) => handleNewUserChange("agentAttorney", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="dateOfPatent"
                  value={newUser.dateOfPatent}
                  onChange={(e) => handleNewUserChange("dateOfPatent", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="agentLicensed"
                  value={newUser.agentLicensed}
                  onChange={(e) => handleNewUserChange("agentLicensed", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="firmOrOrganization"
                  value={newUser.firmOrOrganization}
                  onChange={(e) => handleNewUserChange("firmOrOrganization", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="updatedPhoneNumber"
                  value={newUser.updatedPhoneNumber}
                  onChange={(e) => handleNewUserChange("updatedPhoneNumber", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="emailAddress"
                  value={newUser.emailAddress}
                  onChange={(e) => handleNewUserChange("emailAddress", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="updatedOrganization"
                  value={newUser.updatedOrganization}
                  onChange={(e) => handleNewUserChange("updatedOrganization", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="firmUrl"
                  value={newUser.firmUrl}
                  onChange={(e) => handleNewUserChange("firmUrl", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="Address Line 2updatedAddress"
                  value={newUser.updatedAddress}
                  onChange={(e) => handleNewUserChange("updatedAddress", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="updatedCity"
                  value={newUser.updatedCity}
                  onChange={(e) => handleNewUserChange("updatedCity", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="updatedState"
                  value={newUser.updatedState}
                  onChange={(e) => handleNewUserChange("updatedState", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="updatedCountry"
                  value={newUser.updatedCountry}
                  onChange={(e) => handleNewUserChange("updatedCountry", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="updatedZipcode"
                  value={newUser.updatedZipcode}
                  onChange={(e) => handleNewUserChange("updatedZipcode", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="linkedInProfile"
                  value={newUser.linkedInProfile}
                  onChange={(e) => handleNewUserChange("linkedInProfile", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="notes"
                  value={newUser.notes}
                  onChange={(e) => handleNewUserChange("notes", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="initials"
                  value={newUser.initials}
                  onChange={(e) => handleNewUserChange("initials", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                  <input
                  type="text"
                  placeholder="dataUpdatedAsOn"
                  value={newUser.dataUpdatedAsOn}
                  onChange={(e) => handleNewUserChange("dataUpdatedAsOn", e.target.value)}
                  className="add-user-input"
                />
                </td>
                <td>
                <button onClick={handleAddUser} className="add-user-button"
                style={{width:'auto',
                  borderRadius:'10px',
                  whiteSpace: 'nowrap'
                }}>
                  Add User
                </button>
                </td>
                <td>
                <button onClick={handleUpdateAll} className="Save-button"
                style={{width:'auto'}}>
                Save
              </button>
                </td>
          </tr>
        </table>
        
      </div>

     
    </div>
     </main>
    </div>
    
    
  );
};

export default UserTable;