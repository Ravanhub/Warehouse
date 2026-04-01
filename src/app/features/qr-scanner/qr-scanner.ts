import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { Product } from '../../core/models/api.models';
import { ProductService } from '../../core/services/product';
import { PricePipe } from '../../shared/ui/pipes/price-pipe';
import { AppShellComponent } from '../../shared/ui/app-shell/app-shell';

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats?: string[] }): {
        detect(source: ImageBitmapSource): Promise<Array<{ rawValue?: string }>>;
      };
    };
  }
}

@Component({
  standalone: true,
  selector: 'app-qr-scanner-page',
  imports: [CommonModule, PricePipe, DatePipe, AppShellComponent],
  templateUrl: './qr-scanner.html',
  styleUrls: ['./qr-scanner.css']
})
export class QrScannerPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoRef') private videoRef?: ElementRef<HTMLVideoElement>;

  private readonly productService = inject(ProductService);
  private stream: MediaStream | null = null;
  private detector: { detect(source: ImageBitmapSource): Promise<Array<{ rawValue?: string }>> } | null = null;
  private timer: number | null = null;

  protected readonly scanning = signal(false);
  protected readonly status = signal('Scanner idle. Start camera scanner or paste QR code data.');
  protected readonly product = signal<Product | null>(null);

  ngAfterViewInit() {
    if (window.BarcodeDetector) {
      this.detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    } else {
      this.status.set('This browser does not support BarcodeDetector. Manual QR lookup is still available.');
    }
  }

  ngOnDestroy() {
    this.stopScanner();
  }

  async startScanner() {
    if (!this.detector) {
      this.status.set('BarcodeDetector is not available in this browser.');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      const video = this.videoRef?.nativeElement;
      if (!video) return;

      video.srcObject = this.stream;
      this.scanning.set(true);
      this.status.set('Camera active. Hold a product QR code inside the frame.');

      this.timer = window.setInterval(async () => {
        if (!video.videoWidth || !this.detector) return;
        const results = await this.detector.detect(video);
        const code = results[0]?.rawValue?.trim();

        if (code) {
          this.lookupProduct(code);
          this.stopScanner();
        }
      }, 900);
    } catch {
      this.status.set('Camera permission was denied or unavailable.');
    }
  }

  stopScanner() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.scanning.set(false);
  }

  lookupProduct(qrCode: string) {
    const value = qrCode.trim();
    if (!value) {
      this.status.set('Enter or scan a QR code value first.');
      return;
    }

    this.productService.getProductByQrCode(value).subscribe({
      next: (response) => {
        this.product.set(response.data);
        this.status.set('Product found successfully.');
      },
      error: () => {
        this.product.set(null);
        this.status.set('No product found for this QR code.');
      }
    });
  }
}
