import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTaskReportComponent } from './my-task-report.component';

describe('MyTaskReportComponent', () => {
  let component: MyTaskReportComponent;
  let fixture: ComponentFixture<MyTaskReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTaskReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTaskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
