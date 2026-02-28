import asyncio
import os
import sys

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.core.management.base import BaseCommand
from django.conf import settings
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties

from bot.handlers import start, topics, freetext


class Command(BaseCommand):
    help = "Telegram botni ishga tushiradi (long-polling)"

    def handle(self, *args, **options):
        token = settings.BOT_TOKEN
        if not token:
            self.stderr.write("BOT_TOKEN topilmadi! .env faylini tekshiring.")
            sys.exit(1)

        self.stdout.write(self.style.SUCCESS("🤖 Bot ishga tushmoqda..."))
        asyncio.run(self._run_bot(token))

    async def _run_bot(self, token: str):
        bot = Bot(token=token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
        dp = Dispatcher()

        # Register middlewares
        from bot.middlewares import SubscriptionMiddleware
        dp.message.middleware(SubscriptionMiddleware())

        # Register routers
        dp.include_router(start.router)
        dp.include_router(topics.router)
        dp.include_router(freetext.router)

        print("✅ Bot tayyor! Telegram'da /start yozing.")
        await dp.start_polling(bot, allowed_updates=['message', 'callback_query'])
