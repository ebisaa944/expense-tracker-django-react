from .models import Category
from .serializers import CategorySerializer
from common.viewsets import UserScopedModelViewSet


class CategoryViewSet(UserScopedModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    ordering = ('type', 'name', 'id')
