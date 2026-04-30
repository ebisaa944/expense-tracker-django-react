from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CurrentUserView, EmailTokenObtainPairView, GoogleAuthConfigView, RegisterView, UserSettingsView

urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('settings/', UserSettingsView.as_view(), name='user_settings'),
    path('google/config/', GoogleAuthConfigView.as_view(), name='google_auth_config'),
]
