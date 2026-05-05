from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    CustomTokenObtainView,
    CatViewSet
)

router = DefaultRouter()
router.register('cats', CatViewSet, basename='cat')


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainView.as_view(), name='login'),
    path('', include(router.urls)),
]
