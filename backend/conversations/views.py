from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import TelegramUser, Message, SystemStats
from .serializers import TelegramUserSerializer, MessageSerializer
from knowledge.models import Topic


class TelegramUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TelegramUser.objects.all()
    serializer_class = TelegramUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(full_name__icontains=search) | qs.filter(username__icontains=search)
        return qs


class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.select_related('user', 'topic').all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('user')
        if user_id:
            qs = qs.filter(user_id=user_id)
        return qs


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def stats_view(request):
    try:
        now = timezone.now()
        last_7_days = now - timedelta(days=7)
        last_30_days = now - timedelta(days=30)

        # 1. Persistent Total Messages from SystemStats
        stats, _ = SystemStats.objects.get_or_create(id=1)
        
        # If stats was just created and we already have messages, sync it once
        if stats.total_messages == 0:
            actual_count = Message.objects.count()
            if actual_count > 0:
                stats.total_messages = actual_count
                stats.save()

        total_users = TelegramUser.objects.count()
        total_messages = stats.total_messages  # Use persistent count
        new_users_7d = TelegramUser.objects.filter(created_at__gte=last_7_days).count()
        new_messages_7d = Message.objects.filter(timestamp__gte=last_7_days).count()

        # Daily messages for last 7 days (this reflects actual available history)
        daily_data = []
        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
            count = Message.objects.filter(timestamp__range=(day_start, day_end), role='user').count()
            daily_data.append({
                'date': day.strftime('%d-%b'),
                'messages': count
            })

        # Top topics
        top_topics = (
            Message.objects.filter(topic__isnull=False, timestamp__gte=last_30_days)
            .values('topic__title', 'topic__emoji')
            .annotate(count=Count('id'))
            .order_by('-count')[:5]
        )

        return Response({
            'total_users': total_users,
            'total_messages': total_messages,
            'new_users_7d': new_users_7d,
            'new_messages_7d': new_messages_7d,
            'daily_messages': daily_data,
            'top_topics': list(top_topics),
        })
    except Exception as e:
        print(f"Stats error: {e}")
        return Response({
            'total_users': 0,
            'total_messages': 0,
            'new_users_7d': 0,
            'new_messages_7d': 0,
            'daily_messages': [],
            'top_topics': [],
            'error': str(e)
        }, status=200) # Still return 200 to prevent frontend crash if possible
