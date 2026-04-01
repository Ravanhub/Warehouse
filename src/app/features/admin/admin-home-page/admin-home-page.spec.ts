import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHomePageComponent} from './admin-home-page';

describe('AdminHomePage', () => {
  let component: AdminHomePageComponent;
  let fixture: ComponentFixture<AdminHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHomePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
