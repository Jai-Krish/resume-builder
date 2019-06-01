import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableDivComponent } from './resizable-div.component';

describe('ResizableDivComponent', () => {
  let component: ResizableDivComponent;
  let fixture: ComponentFixture<ResizableDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResizableDivComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
