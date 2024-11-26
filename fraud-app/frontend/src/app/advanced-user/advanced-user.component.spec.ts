import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedUserComponent } from './advanced-user.component';

describe('AdvancedUserComponent', () => {
  let component: AdvancedUserComponent;
  let fixture: ComponentFixture<AdvancedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
