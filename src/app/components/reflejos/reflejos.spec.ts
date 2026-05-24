import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reflejos } from './reflejos';

describe('Reflejos', () => {
  let component: Reflejos;
  let fixture: ComponentFixture<Reflejos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reflejos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reflejos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
