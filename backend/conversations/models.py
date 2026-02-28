from django.db import models


class TelegramUser(models.Model):
    telegram_id = models.BigIntegerField(unique=True, verbose_name="Telegram ID")
    username = models.CharField(max_length=150, blank=True, null=True, verbose_name="Username")
    full_name = models.CharField(max_length=300, blank=True, verbose_name="To'liq ism")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefon")
    language_code = models.CharField(max_length=10, default='uz', verbose_name="Til")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True, verbose_name="Ro'yxatdan o'tgan")
    last_active = models.DateTimeField(auto_now=True, null=True, blank=True, verbose_name="Oxirgi faollik")

    class Meta:
        verbose_name = "Telegram foydalanuvchi"
        verbose_name_plural = "Telegram foydalanuvchilar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name or self.username or str(self.telegram_id)}"


class SystemStats(models.Model):
    total_messages = models.PositiveBigIntegerField(default=0, verbose_name="Jami murojaatlar")

    class Meta:
        verbose_name = "Tizim statistikasi"
        verbose_name_plural = "Tizim statistikasi"

    def __str__(self):
        return f"Statistika: {self.total_messages}"


class Message(models.Model):
    ROLE_CHOICES = [
        ('user', 'Foydalanuvchi'),
        ('bot', 'Bot'),
    ]
    user = models.ForeignKey(TelegramUser, on_delete=models.CASCADE, related_name='messages', verbose_name="Foydalanuvchi")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, verbose_name="Kim")
    text = models.TextField(verbose_name="Xabar matni")
    topic = models.ForeignKey(
        'knowledge.Topic', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='messages', verbose_name="Mavzu"
    )
    timestamp = models.DateTimeField(auto_now_add=True, null=True, blank=True, verbose_name="Vaqt")

    class Meta:
        verbose_name = "Xabar"
        verbose_name_plural = "Xabarlar"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user} [{self.role}]: {self.text[:60]}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:
            # 1. Update persistent stats (Dashboard count)
            stats, _ = SystemStats.objects.get_or_create(id=1)
            stats.total_messages += 1
            stats.save()

            # 2. Check message cap (200 limit)
            # If more than 200 messages exist, delete all except the latest one or follow "start fresh" logic
            if Message.objects.count() > 200:
                # Delete all other messages
                Message.objects.exclude(id=self.id).delete()
