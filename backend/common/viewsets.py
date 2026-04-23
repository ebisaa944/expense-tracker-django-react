from rest_framework import permissions, viewsets


class UserScopedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = None
    ordering = None

    def get_queryset(self):
        queryset = self.queryset.filter(user=self.request.user)

        if self.ordering:
            return queryset.order_by(*self.ordering)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
