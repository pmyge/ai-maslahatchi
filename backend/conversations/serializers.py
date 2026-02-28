from rest_framework import serializers
from .models import TelegramUser, Message


class TelegramUserSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = TelegramUser
        fields = ['id', 'telegram_id', 'username', 'full_name', 'phone', 'language_code', 'created_at', 'last_active', 'message_count']

    def get_message_count(self, obj):
        return obj.messages.count()


class MessageSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    topic_title = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'user', 'user_name', 'role', 'text', 'topic', 'topic_title', 'timestamp']

    def get_user_name(self, obj):
        return obj.user.full_name or obj.user.username or str(obj.user.telegram_id)

    def get_topic_title(self, obj):
        return obj.topic.title if obj.topic else None
