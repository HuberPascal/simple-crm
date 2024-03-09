import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSwapTaskComponent } from './dialog-swap-task.component';

describe('DialogSwapTaskComponent', () => {
  let component: DialogSwapTaskComponent;
  let fixture: ComponentFixture<DialogSwapTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSwapTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSwapTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
