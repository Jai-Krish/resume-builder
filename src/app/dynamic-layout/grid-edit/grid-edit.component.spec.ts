import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEditComponent } from './grid-edit.component';

describe('GridEditComponent', () => {
  let component: GridEditComponent;
  let fixture: ComponentFixture<GridEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
