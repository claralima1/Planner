from django.contrib import admin
from .models import Estudo


@admin.register(Estudo)
class EstudoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'user', 'prioridade', 'concluido', 'data_criacao')
    list_filter = ('prioridade', 'concluido', 'categoria')
    search_fields = ('titulo', 'descricao')
    readonly_fields = ('data_criacao', 'data_atualizacao')
