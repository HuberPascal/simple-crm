import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteProductComponent } from './dialog-delete-product.component';

describe('DialogDeleteProductComponent', () => {
  let component: DialogDeleteProductComponent;
  let fixture: ComponentFixture<DialogDeleteProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
