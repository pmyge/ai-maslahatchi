from django.contrib import admin
from .models import Topic, FAQ


class FAQInline(admin.TabularInline):
    model = FAQ
    extra = 1
    fields = ['question', 'answer', 'is_active']


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['emoji', 'title', 'slug', 'order', 'is_active', 'faq_count']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [FAQInline]

    def faq_count(self, obj):
        return obj.faqs.count()
    faq_count.short_description = "FAQlar"


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['topic', 'question_short', 'is_active', 'updated_at']
    list_filter = ['topic', 'is_active']
    search_fields = ['question', 'answer']
    list_editable = ['is_active']

    def question_short(self, obj):
        return obj.question[:70]
    question_short.short_description = "Savol"
