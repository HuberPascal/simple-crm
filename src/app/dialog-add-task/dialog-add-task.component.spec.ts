import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddTaskConmponent } from './dialog-add-task.component';

describe('AddTaskDialogComponent', () => {
  let component: DialogAddTaskConmponent;
  let fixture: ComponentFixture<DialogAddTaskConmponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAddTaskConmponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddTaskConmponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
