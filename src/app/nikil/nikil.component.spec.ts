import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NikilComponent } from './nikil.component';

describe('NikilComponent', () => {
  let component: NikilComponent;
  let fixture: ComponentFixture<NikilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NikilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NikilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
