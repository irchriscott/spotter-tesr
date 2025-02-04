from __future__ import annotations
from django.contrib.auth.models import AbstractUser
from django.db import models


# Basic user model
class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    favorites = models.ManyToManyField('Book', related_name='favorited_by', blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

# Basic author model
class Author(models.Model):
    name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name

# Basic book model
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title
