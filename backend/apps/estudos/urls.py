from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstudoViewSet

router = DefaultRouter()
router.register(r'', EstudoViewSet, basename='estudos')

urlpatterns = [
    path('', include(router.urls)),
]
