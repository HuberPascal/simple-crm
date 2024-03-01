import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanDragAndDropComponent } from './kanban-drag-and-drop.component';

describe('KanbanDragAndDropComponent', () => {
  let component: KanbanDragAndDropComponent;
  let fixture: ComponentFixture<KanbanDragAndDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanbanDragAndDropComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KanbanDragAndDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
