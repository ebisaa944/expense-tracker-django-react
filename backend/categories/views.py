from .models import Category
from .serializers import CategorySerializer
from .services import ensure_default_categories
from common.viewsets import UserScopedModelViewSet


class CategoryViewSet(UserScopedModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    ordering = ('type', 'name', 'id')

    def get_queryset(self):
        ensure_default_categories(self.request.user)
        return super().get_queryset()
