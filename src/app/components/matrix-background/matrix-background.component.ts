import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

@Component({
  selector: 'app-particles-background',
  templateUrl: './matrix-background.component.html',
  styleUrls: ['./matrix-background.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ParticlesBackgroundComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;
  private particles: Particle[] = [];
  private mouseX: number = 0;
  private mouseY: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initCanvas();
      this.initParticles();
      this.startAnimation();
      this.addMouseListeners();
    }
  }

  private initCanvas(): void {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.canvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.initParticles(); // Recrear partículas al cambiar tamaño
  }

  private initParticles(): void {
    const canvas = this.canvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;

    this.particles = [];
    const particleCount = Math.floor((width * height) / 15000); // Densidad basada en resolución

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomBlueColor()
      });
    }
  }

  private getRandomBlueColor(): string {
    const blues = [
      '#00a8ff', // Azul principal
      '#0099cc', // Azul más oscuro
      '#00bfff', // Azul claro
      '#0080ff', // Azul medio
      '#0066cc'  // Azul profundo
    ];
    return blues[Math.floor(Math.random() * blues.length)];
  }

  private addMouseListeners(): void {
    const canvas = this.canvas.nativeElement;

    canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
      this.mouseX = 0;
      this.mouseY = 0;
    });
  }

  private startAnimation(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = this.ctx;
    const width = canvas.width;
    const height = canvas.height;

    const animate = () => {
      // Limpiar canvas con fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Actualizar y dibujar partículas
      this.particles.forEach((particle, index) => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Efecto de atracción hacia el mouse
        if (this.mouseX > 0 && this.mouseY > 0) {
          const dx = this.mouseX - particle.x;
          const dy = this.mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += dx * force * 0.001;
            particle.vy += dy * force * 0.001;
          }
        }

        // Mantener partículas en pantalla
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Limitar velocidad
        particle.vx = Math.max(-2, Math.min(2, particle.vx));
        particle.vy = Math.max(-2, Math.min(2, particle.vy));

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Conectar partículas cercanas
        this.particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = (100 - distance) / 100 * 0.3;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });

        ctx.globalAlpha = 1;
      });

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
