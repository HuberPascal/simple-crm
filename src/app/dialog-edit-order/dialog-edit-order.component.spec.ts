import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditOrderComponent } from './dialog-edit-order.component';

describe('DialogEditOrderComponent', () => {
  let component: DialogEditOrderComponent;
  let fixture: ComponentFixture<DialogEditOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogEditOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
