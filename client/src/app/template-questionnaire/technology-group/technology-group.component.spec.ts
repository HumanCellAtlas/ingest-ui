import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyGroupComponent } from './technology-group.component';

describe('TechnologyGroupComponent', () => {
  let component: TechnologyGroupComponent;
  let fixture: ComponentFixture<TechnologyGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnologyGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
