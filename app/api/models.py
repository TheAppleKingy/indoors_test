from django.db import models

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Cat(models.Model):
    BREED_CHOICES = [
        ('persian', 'Персидский'),
        ('sphynx', 'Сфинкс'),
        ('bengal', 'Бенгальский'),
        ('maine_coon', 'Мейн-кун'),
        ('british', 'Британский'),
        ('siamese', 'Сиамский'),
    ]

    name = models.CharField(max_length=100, verbose_name='Имя')
    age = models.IntegerField(verbose_name='Возраст')
    breed = models.CharField(max_length=50, choices=BREED_CHOICES, verbose_name='Порода')
    is_fluffy = models.BooleanField(default=True, verbose_name='Пушистый')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cats', verbose_name='Владелец')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.owner.username})"
