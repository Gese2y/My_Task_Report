import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '../loading-bar/loading-bar.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceServiceService } from '../service-service.service';
import { NgxCaptureService } from 'ngx-capture';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import * as html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { BehaviorSubject } from 'rxjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


// import * as ExcelJS from 'exceljs';
@Component({
  selector: 'app-my-task-report',
  templateUrl: './my-task-report.component.html',
  styleUrls: ['./my-task-report.component.css']
})
export class MyTaskReportComponent implements OnInit {
  
  Org: any;
  language: string;
  defaultZoomLevel: number = 0.54;
  Form: UserForm={} as UserForm;
  currentPage = 1;
  pageSize = 10; // Number of items per page
  totalItems = 0; // Total number of items
  totalPages = 0; // Total number of pages
  pageRange: number[] = [];
  paginatedUsers: any[] = [];
  noRecord: boolean=true;
  NumberofApp: number;
  organization: any;
  fitrstappno: any;
  AllApp: any[];
  // currentPage = 1;
  NumberofAllApp: number;
  showMessagepoup: boolean=false;
  message: any;
messages: string[] = []; // Array to store all messages
userss: string[] = []; // Array to store all usernames
currentIndex = 0;
item: any = {};
  data: any;
  filterMeassage: any[];
  MyTaskReport: any;
  UserName: string;
  paginatedMyTaskReport: any;
  RoleName: any;

passAppNo(arg0: any) {
throw new Error('Method not implemented.');
}
  users:any
  constructor(
    // public service: MyServiceService, 
    // public notificationsService: NotificationsService,
    public loadingBarService:LoadingBarService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private service: ServiceServiceService,
    private captureService:NgxCaptureService
    ) {   }
  ngOnInit() {
    this.Form.active=true
    this.getOrganization()
    this.getorg()
    this.getRole()
    this.UserName=environment.username
  this.route.params.subscribe(params => {
   console.log("language", environment.lang);
      if (environment.lang === "am-et" || environment.lang === "am-ET") {
        this.language = "amharic";
      } else {
        this.language = "english";
      }
    });
  }
  
  exportToPDF(): void {
    const element = document.getElementById('data-table');

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('exported_data.pdf');
    });
  }
  exportToPDFAll(): void {
    const element = document.getElementById('data-table2');

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('exported_data.pdf');
    });
  }
  
//   exportAsPdf() {
//   const pdf = new jsPDF();

//   // Loop through each group
//   this.users.forEach((group, index) => {
//     const table = document.getElementById(`data-table-${index}`); // Use unique IDs for each group table
//     html2canvas(table).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const imgProps = pdf.getImageProperties(imgData);
//       const width = pdf.internal.pageSize.getWidth();
//       const height = (imgProps.height * width) / imgProps.width;
      
//       // Add the image of the group to the PDF
//       if (index !== 0) {
//         pdf.addPage(); // Add a new page for each group except the first one
//       }
//       pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      
//       // If it's the last group, save the PDF
//       if (index === this.users.length - 1) {
//         pdf.save('table.pdf');
//       }
//     });
//   });
// }

//   exportAsPdf2() {
//     const table = document.getElementById('data-table');
//     html2canvas(table).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF();
//       const imgProps = pdf.getImageProperties(imgData);
//       const width = pdf.internal.pageSize.getWidth();
//       const height = (imgProps.height * width) / imgProps.width;
//       pdf.addImage(imgData, 'PNG', 0, 0, width, height);
//       pdf.save('table.pdf');
//     });
//   }
  exportAll(){
    this.service.getApplicationStatus('', this.Form.subcity).subscribe((response: any) => {
      // this.AllApp = this.groupRecordsByApplicationNumber(response);
      console.log('allapps',this.AllApp,this.users);
      
      // this.fitrstappno=this.users[0].applicationNumber
      this.NumberofAllApp=this.AllApp.length
      this.exportToExcelAll()
     
    });
  }
  exportSingle(){
    this.exportToExcel()
  }
  exportToExcel(): void {
    const table = document.getElementById('data-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table, { raw: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Generate the Excel file with styles embedded
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
    function s2ab(s: any): ArrayBuffer {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
  
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  exportToExcelAll(): void {
    const table = document.getElementById('data-table2');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table, { raw: true });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    // Generate the Excel file with styles embedded
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
    function s2ab(s: any): ArrayBuffer {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
  
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  



  getOrganization(){
    this.service.getOrganization().subscribe((response:any)=>{
      this.organization=response.procorganizationss.filter((value)=>
        value.organization_code !='3d26a10c-9be9-4261-bf97-ab6f39455ed3'&&
        value.organization_code !='275619f2-69c2-4fb7-a053-938f0b62b088'&&
        // value.organization_code !='1efb0336-26c6-4bf1-aeb8-8da0d4f7dbbb'&&
        value.organization_code !='5ef1475c-2b66-4087-b1b7-63e6c6cd7ca1'&&
        value.organization_code !='1809e356-d00f-42f9-8425-41a149dfd60f');
      console.log('response',this.organization);
    })
  }
// Declare variables to store messages, usernames, and current index
 // Current index of the message being displayed
// Initialize item object in your component
 // You can replace 'any' with a specific type if available

// Rest of your component code...


// Calculate starting page number for pagination
getStartingPageNumber(currentPage: number): number {
  if (currentPage <= 2) {
    return 1;
  } else {
    return currentPage - 1;
  }
}
close(){
  this.showMessagepoup = false;
}
displayMessage(userName: any, Appno: any,todocode: any) {
  this.service.getPostitnote(Appno, userName).subscribe((response: any[]) => {
    // Store messages and usernames in arrays
    this.filterMeassage=response.filter((value)=>value.postit_note_code==todocode)
    this.messages = this.filterMeassage.map(item => item.remarks);
    this.userss = this.filterMeassage.map(item => item.userName);
    console.log('logpostitnote', this.filterMeassage,todocode);
    this.showMessagepoup = true;
    // Update the header username
    this.item.username = this.userss[this.currentIndex];
  });
}
displayAllMessage(Appno: any) {
  this.service.getPostitnote(Appno,'').subscribe((response: any[]) => {
    // Store messages and usernames in arrays
    this.messages = response.map(item => item.remarks);
    this.userss = response.map(item => item.userName);
    // console.log('logpostitnote', this.filterMeassage,todocode);
    this.showMessagepoup = true;
    // Update the header username
    this.item.username = this.userss[this.currentIndex];
  });
}

next() {
  if (this.currentIndex < this.messages.length - 1) {
    this.currentIndex++; // Move to the next message if available
    // Update the header username
    this.item.username = this.userss[this.currentIndex];
  }
}

previous() {
  if (this.currentIndex > 0) {
    this.currentIndex--; // Move to the previous message if available
    // Update the header username
    this.item.username = this.userss[this.currentIndex];
  }
}


  
  passSubcity(values) {
    this.Form.subcity=values}

    passRole_Name(values) {
      this.Form.Role_Name=values}
  
   getRole() {
  this.service.getRoleName().subscribe((res:any)=>{
    this.RoleName=res.procSp_GetRoless
  })    
  }
  
    getMyTaskReport() {
      this.noRecord = true;
      this.loadingBarService.loadingBarSubject = new BehaviorSubject<boolean>(true);
      if (this.Form.applictaion_Number == undefined) {
        this.Form.applictaion_Number = '';
      }
    
      this.service.getMyTaskReport(this.Form.subcity, this.Form.Role_Name, this.UserName, this.Form.start_Date, this.Form.end_date).subscribe((response: any) => {
        this.MyTaskReport = response.procGetTodo_dashbord_Deatils;
        console.log('MyTaskReport', this.MyTaskReport);
        this.totalPages = Math.ceil(this.MyTaskReport.length / this.pageSize);
        this.pageRange = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Generate array from 1 to totalPages
        this.changePage(1);
        this.noRecord = false;
        this.loadingBarService.loadingBarSubject = new BehaviorSubject<boolean>(false);
      });
    }
    
    changePage(page: number) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.MyTaskReport.length);
      this.paginatedMyTaskReport = this.MyTaskReport.slice(startIndex, endIndex);
      this.updatePageRange();
    }
    
    updatePageRange() {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, this.currentPage + 2);
      this.pageRange = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => i + startPage);
    }
    


  goToFirstPage() {
    if (this.currentPage !== 1) {
      this.changePage(1);
    }
  }
  
  goToLastPage() {
    if (this.currentPage !== this.totalPages) {
      this.changePage(this.totalPages);
    }
  }

  getorg() {
    // this.loadingBarService.loadingBarSubject = new BehaviorSubject<boolean>(true);
    this.service.getorg().subscribe((org) => {
      this.Org = org;
      this.Org = this.Org.filter((value)=>
      value.organization_code !='3d26a10c-9be9-4261-bf97-ab6f39455ed3'&&
      value.organization_code !='275619f2-69c2-4fb7-a053-938f0b62b088'&&
      // value.organization_code !='1efb0336-26c6-4bf1-aeb8-8da0d4f7dbbb'&&
      value.organization_code !='5ef1475c-2b66-4087-b1b7-63e6c6cd7ca1'&&
      value.organization_code !='1809e356-d00f-42f9-8425-41a149dfd60f');
      
      // this.loadingBarService.loadingBarSubject = new BehaviorSubject<boolean>(false);

      console.log("this.Org", this.Org);
      console.log("this.Org", org);
    });
  }
  
  

  
 


  
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
  
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  check(){
    console.log('ischecked',this.Form.active);
    
  }
}
export class UserForm {
  public  id: any
  public subcity: any
  public woreda: number
  public userId: any
  public service_Id: any
  public active: any
  public applictaion_Number: any
  public end_date: any
  public start_Date: any
  public Role_Name: any;
}