import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScannerPageComponent } from './qr-scanner';

describe('QrScanner', () => {
  let component: QrScannerPageComponent;
  let fixture: ComponentFixture<QrScannerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrScannerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QrScannerPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
