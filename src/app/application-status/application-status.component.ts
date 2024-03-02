import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from '../loading-bar/loading-bar.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceServiceService } from '../service-service.service';
import { NgxCaptureService } from 'ngx-capture';
import { NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import * as html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.css']
})
export class ApplicationStatusComponent implements OnInit {
  
  Org: any;
  language: string;
  
  Form: UserForm={} as UserForm;
  currentPage = 1;
  pageSize = 1; // Number of items per page
  totalItems = 0; // Total number of items
  totalPages = 0; // Total number of pages
  pageRange: number[] = [];
  paginatedUsers: any[] = [];
  noRecord: boolean=true;

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
  this.getorg()
  this.route.params.subscribe(params => {
   console.log("language", environment.lang);
      if (environment.lang === "am-et" || environment.lang === "am-ET") {
        this.language = "amharic";
      } else {
        this.language = "english";
      }
    });
  }
  exportAsPdf() {
    const table = document.getElementById('data-table');
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const width = pdf.internal.pageSize.getWidth();
      const height = (imgProps.height * width) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('table.pdf');
    });
  }
  passSubcity(values) {
    this.Form.subcity=values}
  getApplicatStatus() {
    this.noRecord=true
    this.loadingBarService.loadingBarSubject= new BehaviorSubject<boolean>(true);
    if (this.Form.applictaion_Number==undefined) {
      this.Form.applictaion_Number=''
      
    }
    
    this.service.getApplicationStatus(this.Form.applictaion_Number, this.Form.subcity).subscribe((response: any) => {
      this.users = this.groupRecordsByApplicationNumber(response);
      this.totalPages = Math.ceil(this.users.length / this.pageSize);
      this.pageRange = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Generate array from 1 to totalPages
      this.changePage(1);
      console.log('responseee', this.users[0].records);
      this.noRecord=false
      this.loadingBarService.loadingBarSubject= new BehaviorSubject<boolean>(false);
    });
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
  groupRecordsByApplicationNumber(records: any[]): any[] {
    const groupedRecords: any[] = [];
    const groupedMap: Map<string, any[]> = new Map();
  
    for (const record of records) {
      const applicationNumber = record.aNo;
      const servName = record.service_Name;
      const servD = record.service_dilivery_point;
      const key = `${applicationNumber}_${servName}_${servD}`;
  
      if (groupedMap.has(key)) {
        groupedMap.get(key).push(record);
      } else {
        groupedMap.set(key, [record]);
      }
    }
  
    groupedMap.forEach((groupedRecordsArray, key) => {
      const sortedRecords = groupedRecordsArray.sort((a, b) => a.step - b.step);
  
      const [applicationNumber, servName, servD] = key.split('_');
      const group = {
        applicationNumber: applicationNumber,
        servName: servName,
        servD: servD,
        records: sortedRecords
      };
  
      groupedRecords.push(group);
    });
  
    return groupedRecords;
  }
  getorg() {
    this.service.getorg().subscribe((org) => {
      this.Org = org;
      this.Org = this.Org.filter((value)=>
      value.organization_code !='3d26a10c-9be9-4261-bf97-ab6f39455ed3'&&
      value.organization_code !='275619f2-69c2-4fb7-a053-938f0b62b088'&&
      value.organization_code !='1efb0336-26c6-4bf1-aeb8-8da0d4f7dbbb'&&
      value.organization_code !='5ef1475c-2b66-4087-b1b7-63e6c6cd7ca1'&&
      value.organization_code !='1809e356-d00f-42f9-8425-41a149dfd60f');
    

      console.log("this.Org", this.Org);
      console.log("this.Org", org);
    });
  }
  
  

  
 

  changePage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  
    // Calculate the pageRange based on the current page
    const rangeStart = Math.max(1, this.currentPage - 2);
    const rangeEnd = Math.min(rangeStart + 4, this.totalPages);
    this.pageRange = Array.from({ length: rangeEnd - rangeStart + 1 }, (_, i) => rangeStart + i);
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
  updatePageRange() {
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    this.pageRange = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => i + startPage);
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
}