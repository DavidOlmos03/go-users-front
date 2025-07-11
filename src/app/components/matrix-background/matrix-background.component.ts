import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-matrix-background',
  templateUrl: './matrix-background.component.html',
  styleUrls: ['./matrix-background.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class MatrixBackgroundComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCanvas();
      this.startAnimation();
    }
  }

  private initCanvas(): void {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    // Configurar el tamaño del canvas
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.canvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private startAnimation(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;

    // Configuración de la lluvia Matrix
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    // Inicializar las gotas
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Caracteres Matrix
    const matrix = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()_+-=[]{}|;:,.<>?';

    const draw = () => {
      // Fondo semi-transparente para crear efecto de desvanecimiento
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Color del texto Matrix
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      // Dibujar los caracteres
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Mover la gota hacia abajo
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
