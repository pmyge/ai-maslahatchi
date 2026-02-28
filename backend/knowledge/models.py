from django.db import models


class Topic(models.Model):
    """10 ta asosiy mavzu"""
    slug = models.SlugField(unique=True, verbose_name="Kalit so'z")
    title = models.CharField(max_length=200, verbose_name="Mavzu nomi")
    emoji = models.CharField(max_length=10, default="📋", verbose_name="Emoji")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        verbose_name = "Mavzu"
        verbose_name_plural = "Mavzular"
        ordering = ['order']

    def __str__(self):
        return f"{self.emoji} {self.title}"


class FAQ(models.Model):
    """Har bir mavzu uchun savol va sodda javob"""
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='faqs', verbose_name="Mavzu")
    question = models.CharField(max_length=500, verbose_name="Savol")
    answer = models.TextField(verbose_name="Javob (sodda tilda)")
    is_active = models.BooleanField(default=True, verbose_name="Faolmi?")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        verbose_name = "Savol-Javob"
        verbose_name_plural = "Savol-Javoblar"

    def __str__(self):
        return f"{self.topic.title} — {self.question[:50]}"
