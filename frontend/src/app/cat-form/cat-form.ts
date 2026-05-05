import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatService } from '../services/cat';
import { Cat } from '../models/cat';

@Component({
  selector: 'app-cat-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cat-form.html',
  styleUrls: ['./cat-form.css']
})
export class CatFormComponent implements OnInit {
  cat: Cat = {
    name: '',
    age: 0,
    breed: 'persian',
    is_fluffy: true
  };
  isEditMode = false;
  loading = false;
  error = '';

  breeds = [
    { value: 'persian', label: 'Персидский' },
    { value: 'sphynx', label: 'Сфинкс' },
    { value: 'bengal', label: 'Бенгальский' },
    { value: 'maine_coon', label: 'Мейн-кун' },
    { value: 'british', label: 'Британский' },
    { value: 'siamese', label: 'Сиамский' }
  ];

  constructor(
    private catService: CatService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode = true;
      this.loadCat(+id);
    }
  }

  loadCat(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.catService.getCat(id).subscribe({
      next: (data) => {
        this.cat = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки кота';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (!this.cat.name || !this.cat.age || !this.cat.breed) {
      this.error = 'Заполните все поля';
      return;
    }

    if (this.cat.age < 0 || this.cat.age > 30) {
      this.error = 'Возраст должен быть от 0 до 30 лет';
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.catService.updateCat(this.cat.id!, this.cat).subscribe({
        next: () => {
          this.router.navigate(['/cats']);
        },
        error: (err) => {
          this.error = 'Ошибка обновления кота';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.catService.createCat(this.cat).subscribe({
        next: () => {
          this.router.navigate(['/cats']);
        },
        error: (err) => {
          this.error = 'Ошибка создания кота';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}