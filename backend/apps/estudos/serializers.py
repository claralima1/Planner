from rest_framework import serializers
from .models import Estudo


class EstudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudo
        fields = (
            'id',
            'titulo',
            'descricao',
            'duracao',
            'concluido',
            'categoria',
            'prioridade',
            'data_criacao',
            'data_atualizacao',
        )
        read_only_fields = ('id', 'data_criacao', 'data_atualizacao')
