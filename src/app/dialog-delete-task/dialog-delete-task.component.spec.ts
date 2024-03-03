import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteTaskComponent } from './dialog-delete-task.component';

describe('DialogDeleteTaskComponent', () => {
  let component: DialogDeleteTaskComponent;
  let fixture: ComponentFixture<DialogDeleteTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
