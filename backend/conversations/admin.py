from django.contrib import admin
from .models import TelegramUser, Message, SystemStats


@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'username', 'telegram_id', 'message_count', 'created_at', 'last_active']
    search_fields = ['full_name', 'username', 'telegram_id']
    readonly_fields = ['telegram_id', 'created_at', 'last_active']

    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = "Xabarlar"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'text_short', 'topic', 'timestamp']
    list_filter = ['role', 'topic', 'timestamp']
    search_fields = ['text', 'user__full_name', 'user__username']
    readonly_fields = ['timestamp']

    def text_short(self, obj):
        return obj.text[:80]
    text_short.short_description = "Xabar"
@admin.register(SystemStats)
class SystemStatsAdmin(admin.ModelAdmin):
    list_display = ['total_messages']
