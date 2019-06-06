import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridRowColComponent } from './grid-row-col.component';

describe('GridRowColComponent', () => {
  let component: GridRowColComponent;
  let fixture: ComponentFixture<GridRowColComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridRowColComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridRowColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
