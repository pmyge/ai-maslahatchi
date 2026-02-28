from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from .models import Topic, FAQ
from .serializers import TopicSerializer, TopicListSerializer, FAQSerializer


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return TopicListSerializer
        return TopicSerializer


class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.select_related('topic').all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        topic_id = self.request.query_params.get('topic')
        if topic_id:
            qs = qs.filter(topic_id=topic_id)
        return qs
