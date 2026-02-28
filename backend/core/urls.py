from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from knowledge.views import TopicViewSet, FAQViewSet
from conversations.views import TelegramUserViewSet, MessageViewSet, stats_view

router = DefaultRouter()
router.register(r'topics', TopicViewSet, basename='topics')
router.register(r'faqs', FAQViewSet, basename='faqs')
router.register(r'users', TelegramUserViewSet, basename='users')
router.register(r'messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/stats/', stats_view, name='stats'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
