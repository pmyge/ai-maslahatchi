from rest_framework import serializers
from .models import Topic, FAQ


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'topic', 'question', 'answer', 'is_active', 'created_at', 'updated_at']


class TopicSerializer(serializers.ModelSerializer):
    faqs = FAQSerializer(many=True, read_only=True)
    faq_count = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'slug', 'title', 'emoji', 'order', 'is_active', 'faq_count', 'faqs', 'created_at']

    def get_faq_count(self, obj):
        return obj.faqs.count()


class TopicListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views (no nested FAQs)"""
    faq_count = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'slug', 'title', 'emoji', 'order', 'is_active', 'faq_count', 'created_at']

    def get_faq_count(self, obj):
        return obj.faqs.count()
