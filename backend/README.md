# Django DRF Backend para Planner

Backend em Django REST Framework com autenticação JWT.

## Setup

```bash
# Criar virtual environment
python -m venv venv
source venv/bin/activate  # no Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Executar migrações
python manage.py migrate

# Criar superusuário (opcional)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

## Estrutura

```
backend/
├── apps/
│   ├── auth/          # Autenticação e JWT
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── authentication.py  # JWT customizado
│   │   └── urls.py
│   └── estudos/       # Gerenciamento de estudos
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
├── config/            # Configurações do Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── requirements.txt
```

## API Endpoints

### Autenticação
- `POST /api/auth/register/` - Registrar novo usuário
- `POST /api/auth/login/` - Fazer login
- `GET /api/auth/me/` - Dados do usuário autenticado

### Estudos
- `GET /api/estudos/` - Listar estudos do usuário
- `POST /api/estudos/` - Criar novo estudo
- `GET /api/estudos/{id}/` - Obter detalhes de um estudo
- `PUT /api/estudos/{id}/` - Atualizar estudo
- `PATCH /api/estudos/{id}/` - Atualizar parcialmente
- `DELETE /api/estudos/{id}/` - Deletar estudo

## Autenticação

Todos os requests às rotas de estudos devem incluir o header:
```
Authorization: Bearer <token>
```

O token é obtido ao fazer login ou registrar um novo usuário.

## Frontend Integration

Atualize o `httpClient.ts` do frontend para apontar para:
```
http://localhost:8000
```

O token é automaticamente incluído nos headers de todas as requisições.
