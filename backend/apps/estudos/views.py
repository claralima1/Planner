from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Estudo
from .serializers import EstudoSerializer


class EstudoViewSet(viewsets.ModelViewSet):
    serializer_class = EstudoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retorna apenas os estudos do usuário autenticado"""
        return Estudo.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Cria um novo estudo associado ao usuário autenticado"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Atualiza o estudo"""
        estudo = self.get_object()
        # Garante que o usuário só pode editar seus próprios estudos
        if estudo.user != self.request.user:
            return Response(
                {'error': 'Permissão negada'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        """Deleta o estudo"""
        if instance.user != self.request.user:
            return Response(
                {'error': 'Permissão negada'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()
