import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataDetailsDialogComponent } from './metadata-details-dialog.component';

describe('MetadataDetailsComponent', () => {
  let component: MetadataDetailsDialogComponent;
  let fixture: ComponentFixture<MetadataDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
