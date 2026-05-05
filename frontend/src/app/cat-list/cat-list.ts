import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CatService } from '../services/cat';
import { Cat } from '../models/cat';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-cat-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cat-list.html',
  styleUrls: ['./cat-list.css']
})
export class CatListComponent implements OnInit {
  cats: Cat[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;

  constructor(
    private catService: CatService, 
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn) {
      this.loadCats();
    }
  }

  loadCats(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.catService.getCats().subscribe({
      next: (data) => {
        this.cats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки котов';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  deleteCat(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этого кота?')) {
      this.catService.deleteCat(id).subscribe({
        next: () => {
          this.loadCats();
        },
        error: (err) => {
          this.error = 'Ошибка удаления';
          console.error(err);
        }
      });
    }
  }

  editCat(id: number): void {
    this.router.navigate([`/cats/${id}/edit`]);
  }
}