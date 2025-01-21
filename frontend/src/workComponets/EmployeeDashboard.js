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
  const admin = users.length > 0 ? users[0].admin : false;
  const [filter, setFilter] = useState("");
  const [editedUsers, setEditedUsers] = useState({});
  const [newUser, setNewUser] = useState({});
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

      .get(`http://localhost:3001/api/fetch-users?userId=${userId}`)
      // // .get(`${API_URL}/api/fetch-users?userId=${userId}`)
      .then((response) => {
        console.log("Response from backend:", response.data);
        setUsers(response.data.data); // Assuming 'data' contains the fetched data
        // console.log('admin:',response.data.admin);
        // setAdmin(response.data.admin)
        
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
    const updates = users.map((user, index) => ({
      slNo: user.slNo, // Assuming slNo is unique for each user
      ...editedUsers[user.slNo] || {}, // Spread the edited fields
    }));

    console.log("Sending updates to backend:", updates); // Add this line to verify the updates

    axios
      .put('http://localhost:3001/api/update-users', updates)
      .then((response) => {
        console.log(response.data.message);
        fetchUsers(); // Refresh users after update
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
    if (!newUser.name || !newUser.organization) {
        alert("Please fill all required fields.");
        return;
    }

    const dataToSend = { ...newUser, userId, admin};
      console.log('userId:',userId);
      console.log('admin:',admin);

    // console.log("Adding user:", dataToSend);

    axios
        .post('http://localhost:3001/api/add-user', dataToSend)
        .then((response) => {
            console.log(response.data.message);
            // fetchAllUsers();
            setNewUser({
                slNo: "",
                name: "",
                organization:"",
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
// Function to fetch all users
const fetchAllUsers = () => {
    axios
        .get('http://localhost:3001/api/fetch-users') // Assuming the endpoint fetches the latest users
        .then((response) => {
            console.log("Fetched users:", response.data);
            setUsers(response.data.data); // Assuming 'data' is the array of users
        })
        .catch((error) => {
            console.error("Error fetching users:", error);
            alert("Failed to fetch users. Please try again.");
        });
};

  // console.log('updatedPhoneNumber:',users.updatedPhoneNumber);
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
//in A3 it's looks good
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
        0: { cellWidth: 10 }, // Reduce width for _id
        1: { cellWidth: 6 },
        2: { cellWidth: 12 },
        3: { cellWidth: 12 }, // Reduce width for slNo
        4: { cellWidth: 13 },
        5: { cellWidth: 13 },
        6: { cellWidth: 10 }, //city
        7: { cellWidth: 8 },
        8: { cellWidth: 10 }, //country
        10: { cellWidth: 15 },
        11: { cellWidth: 10 }, //reg Cod
        12: { cellWidth: 15 },
        13: { cellWidth: 15 },
        14: { cellWidth: 15 },//agentLicensed       
        15: { cellWidth: 10 },
        16: { cellWidth: 11 },//updated phone number
        17: { cellWidth: 12 }, //email
        18: { cellWidth: 10 }, //updated organization
        18: { cellWidth: 10 },//firmUrl
        19: { cellWidth: 12 },//updatedAddress        
        20: { cellWidth: 11 },
        21: { cellWidth: 12 },
        22: { cellWidth: 12 },
        23: { cellWidth: 10 },
        24: { cellWidth: 10 },
        25: { cellWidth: 15 },//linkdin
        26: { cellWidth: 10 },//notes
        27: { cellWidth: 10 },//initials
        28: { cellWidth: 15 },//dateUpdatedAsOn
        29: { cellWidth: 15 },
        // Adjust or add more columns if needed
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    doc.save("users.pdf");
  };

const showNMessage = () => {
  alert('Not Permited');
  // return showNMessage;
}

const navigate = useNavigate();
function gohome() {
  const userConfirmed = window.confirm('Do you want to exit?');
  if (userConfirmed) {
        navigate('/');
  } else {
    console.log('User chose to stay on the page.');
  }
}


  return (
    <div>
      <header className="header12">
      <img onClick={gohome} src="../Triangle-IP-Logo.png" ></img>
      <img onClick={gohome} src="../Triangle-IP-Logo.png" ></img>
      <img onClick={gohome} src="../Triangle-IP-Logo.png" ></img>
        {/* <i  onClick={gohome} class="fa-solid fa-house"></i> */}
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
      <button onClick={handleDownload} className="Download-button" style={{cursor:'pointer'}}>
        Download
      </button>

    </div>
    <button onClick={handleUpdateAll} style={{cursor:'pointer'}}>
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
            <th>Organization</th>
            <th>Address Line 1</th>
            <th>Address Line 2</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Zipcode</th>
            <th>Phone Number</th>
            <th>Reg Code </th>
            <th>Attorney</th>
            <th>Date of Patent</th>
            <th>Agent Licensed</th>
            <th>Firm or Organization</th>
            <th>Updated Phone Number</th>
            <th>Email Address</th>
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

            <th>EditSaveDelete</th>

          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.name.toLowerCase().includes(filter.toLowerCase()))
            .map((user, index) => (
              <tr key={index}>
                {/* <td>{user.slNo}</td> */}
                <td>{index+1}</td>
                <td>
                        <input
                          type="text"
                          defaultValue={editedUsers[user.slNo]?.name || user.name}
                          onChange={(e) =>
                            handleEdit(user.slNo, "name", e.target.value)
                          }
                          className="editable-input"
                        />
                  </td>
                  <td>
                        <input
                          type="text"
                          defaultValue={editedUsers[user.slNo]?.organization || user.organization}
                          onChange={(e) =>
                            handleEdit(user.slNo, "organization", e.target.value)
                          }
                          className="editable-input"
                        />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.addressLine1 || user.addressLine1}
                      onChange={(e) => {
                        handleEdit(user.slNo, "addressLine1", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.addressLine2 || user.addressLine2}
                      onChange={(e) => {
                        handleEdit(user.slNo, "addressLine2", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.city || user.city}
                      onChange={(e) => {
                        handleEdit(user.slNo, "city", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.state || user.state}
                      onChange={(e) => {
                        handleEdit(user.slNo, "state", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.country || user.country}
                      onChange={(e) => {
                        handleEdit(user.slNo, "country", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.zipcode || user.zipcode}
                      onChange={(e) => {
                        handleEdit(user.slNo, "zipcode", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.phoneNumber || user.phoneNumber}
                      onChange={(e) => {
                        handleEdit(user.slNo, "phoneNumber", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.regCode || user.regCode}
                      onChange={(e) => {
                        handleEdit(user.slNo, "regCode", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.agentAttorney || user.agentAttorney}
                      onChange={(e) => {
                        handleEdit(user.slNo, "agentAttorney", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.dateOfPatent || user.dateOfPatent}

                      onChange={(e) => {
                        handleEdit(user.slNo, "dateOfPatent", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.agentLicensed || user.agentLicensed}

                      onChange={(e) => {
                        handleEdit(user.slNo, "agentLicensed", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.firmOrOrganization || user.firmOrOrganization}

                      onChange={(e) => {
                        handleEdit(user.slNo, "firmOrOrganization", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedPhoneNumber || user.updatedPhoneNumber}

                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedPhoneNumber", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>


                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.emailAddress || user.emailAddress}
                      onChange={(e) => {
                        handleEdit(user.slNo, "emailAddress", e.target.value);

                      }}
                      className="editable-input"
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedOrganization || user.updatedOrganization}
                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedOrganization", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.firmUrl || user.firmUrl}
                      onChange={(e) => {
                        handleEdit(user.slNo, "firmUrl", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedAddress || user.updatedAddress}
                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedAddress", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedCity || user.updatedCity}
                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedCity", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedState || user.updatedState}
                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedState", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedCountry || user.updatedCountry}
                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedCountry", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.updatedZipcode || user.updatedZipcode}
                      onChange={(e) => {
                        handleEdit(user.slNo, "updatedZipcode", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.linkedInProfile || user.linkedInProfile}
                      onChange={(e) => {
                        handleEdit(user.slNo, "linkedInProfile", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.notes || user.notes}
                      onChange={(e) => {
                        handleEdit(user.slNo, "notes", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                  <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.initials || user.initials}
                      onChange={(e) => {
                        handleEdit(user.slNo, "initials", e.target.value);

                      }}
                      className="editable-input"
                    />
                </td>
                    <td>
                    <input
                      type="text"
                      defaultValue={editedUsers[user.slNo]?.dataUpdatedAsOn || user.dataUpdatedAsOn}
                      onChange={(e) => {
                        handleEdit(user.slNo, "dataUpdatedAsOn", e.target.value);

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
                  <button style={{width:'auto',cursor: 'pointer',fontSize: '10px',padding:'7px', margin: '0', background:'green'}} onClick={updating}>{loading ? 'edited?' : 'edit'}</button>
                  <button style={{width:'auto', cursor: 'pointer',fontSize: '10px',padding:'7px', margin: '2px', background:'green'}} onClick={updatingSaveButton}>save</button>
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
        <table className='user-table2'>
          <tr>
           {/* <td>
                  <input
                  type="text"
                  placeholder="Sl. No"
                  value={newUser.slNo}
                  onChange={(e) => handleNewUserChange("slNo", e.target.value)}
                  className="add-user-input"
                  />
                </td> */}
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
                    placeholder="Organization"
                    value={newUser.organization}
                    onChange={(e) => handleNewUserChange("organization", e.target.value)}
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
                    placeholder="City"
                    value={newUser.city}
                    onChange={(e) => handleNewUserChange("city", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="State"
                    value={newUser.state}
                    onChange={(e) => handleNewUserChange("state", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Country"
                    value={newUser.country}
                    onChange={(e) => handleNewUserChange("country", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Zipcode"
                    value={newUser.zipcode}
                    onChange={(e) => handleNewUserChange("zipcode", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newUser.phoneNumber}
                    onChange={(e) => handleNewUserChange("phoneNumber", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Reg Code"
                    value={newUser.regCode}
                    onChange={(e) => handleNewUserChange("regCode", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Agent/Attorney"
                    value={newUser.agentAttorney}
                    onChange={(e) => handleNewUserChange("agentAttorney", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Date of Patent"
                    value={newUser.dateOfPatent}
                    onChange={(e) => handleNewUserChange("dateOfPatent", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Agent Licensed"
                    value={newUser.agentLicensed}
                    onChange={(e) => handleNewUserChange("agentLicensed", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Firm or Organization"
                    value={newUser.firmOrOrganization}
                    onChange={(e) => handleNewUserChange("firmOrOrganization", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated Phone Number"
                    value={newUser.updatedPhoneNumber}
                    onChange={(e) => handleNewUserChange("updatedPhoneNumber", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Email Address"
                    value={newUser.emailAddress}
                    onChange={(e) => handleNewUserChange("emailAddress", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated Organization"
                    value={newUser.updatedOrganization}
                    onChange={(e) => handleNewUserChange("updatedOrganization", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Firm/Organization URL"
                    value={newUser.firmUrl}
                    onChange={(e) => handleNewUserChange("firmUrl", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated Address"
                    value={newUser.updatedAddress}
                    onChange={(e) => handleNewUserChange("updatedAddress", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated City"
                    value={newUser.updatedCity}
                    onChange={(e) => handleNewUserChange("updatedCity", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated State"
                    value={newUser.updatedState}
                    onChange={(e) => handleNewUserChange("updatedState", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated Country"
                    value={newUser.updatedCountry}
                    onChange={(e) => handleNewUserChange("updatedCountry", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Updated Zipcode"
                    value={newUser.updatedZipcode}
                    onChange={(e) => handleNewUserChange("updatedZipcode", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="LinkedIn Profile"
                    value={newUser.linkedInProfile}
                    onChange={(e) => handleNewUserChange("linkedInProfile", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Notes"
                    value={newUser.notes}
                    onChange={(e) => handleNewUserChange("notes", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Initials"
                    value={newUser.initials}
                    onChange={(e) => handleNewUserChange("initials", e.target.value)}
                    className="add-user-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Data Updated As On"
                    value={newUser.dataUpdatedAsOn}
                    onChange={(e) => handleNewUserChange("dataUpdatedAsOn", e.target.value)}
                    className="add-user-input"
                  />
                </td>

                <td>
                <button onClick={handleAddUser} className="add-user-button"
                style={{width:'auto',
                  borderRadius:'10px',
                  whiteSpace: 'nowrap',

                }}>
                  Add User
                </button>
                </td>
                <td>
                <button onClick={handleUpdateAll} className="Save-button"
                style={{width:'auto', background:'green'}}>
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