import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteOrderComponent } from './dialog-delete-order.component';

describe('DialogDeleteOrderComponent', () => {
  let component: DialogDeleteOrderComponent;
  let fixture: ComponentFixture<DialogDeleteOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
