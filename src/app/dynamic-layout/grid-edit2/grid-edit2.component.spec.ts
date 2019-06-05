import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridEdit2Component } from './grid-edit2.component';

describe('GridEdit2Component', () => {
  let component: GridEdit2Component;
  let fixture: ComponentFixture<GridEdit2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridEdit2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridEdit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
