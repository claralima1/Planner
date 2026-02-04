from django.db import models
from django.contrib.auth.models import User


class Estudo(models.Model):
    PRIORIDADE_CHOICES = [
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='estudos')
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    duracao = models.FloatField()  # em horas
    concluido = models.BooleanField(default=False)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    prioridade = models.CharField(
        max_length=10,
        choices=PRIORIDADE_CHOICES,
        default='media'
    )
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-data_criacao']
        verbose_name = 'Estudo'
        verbose_name_plural = 'Estudos'
    
    def __str__(self):
        return f"{self.titulo} - {self.user.username}"
