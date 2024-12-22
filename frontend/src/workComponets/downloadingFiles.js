// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import users from './EmployeeDashboard.js';

// const downloadFile = () => {
//     const handleDownload = () => {
//         if (downloadFormat === "xlsx") {
//           downloadAsExcel();
//         } else if (downloadFormat === "pdf") {
//           downloadAsPDF();
//         } else {
//           alert("Please select a format to download!");
//         }
//         return handleDownload;
//       };
    
//       const downloadAsExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(users);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
//         XLSX.writeFile(workbook, "users.xlsx");
//       };
    
//       const downloadAsPDF = () => {
//         const doc = new jsPDF('landscape 10cm a3');
//         const tableColumn = Object.keys(users[0]);  
//         const tableRows = users.map(user => Object.values(user));
    
//         doc.autoTable({
//           head: [tableColumn],
//           body: tableRows,
//           styles: { fontSize: 10 },
//         });
    
//         doc.save("users.pdf");
//       };
    
// }

// export default downloadFile;