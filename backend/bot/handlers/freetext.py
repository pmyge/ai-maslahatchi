import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from aiogram import Router, F
from aiogram.types import Message, ReplyKeyboardRemove
from conversations.models import TelegramUser, Message as ChatMessage
from bot.keyboards import TOPICS, main_menu_keyboard
from bot.utils import ai_service

router = Router()

TOPIC_LABELS = {label for label, _ in TOPICS}
RESERVED = TOPIC_LABELS | {"🏠 Asosiy menyu", "✍️ Savol berish", "/start"}

FALLBACK_TEXT = (
    "Savolingiz uchun rahmat! 🙏\n\n"
    "Hozircha bu mavzu bo'yicha avtomatik javob yo'q.\n\n"
    "Quyidagilardan yordam olishingiz mumkin:\n\n"
    "🏢 <b>Do'stlik tumani Davlat xizmatlari markazi</b>\n"
    "📍 Do'stlik tumani, markaziy ko'cha\n"
    "🕐 Ish vaqti: Du-Ju 9:00-18:00\n\n"
    "Yoki yuqoridagi <b>tugmalardan birini</b> tanlang.\n\n"
    "✅ Agar xohlasangiz, yana savol berishingiz mumkin"
)


@router.message(F.text == "✍️ Savol berish")
async def ask_free_question(message: Message):
    await message.answer(
        "✍️ Savolingizni yozing, men javob beraman!\n"
        "(Masalan: \"Bolalar nafaqasi uchun qanday hujjat kerak?\")",
        reply_markup=ReplyKeyboardRemove()
    )


@router.message(F.text & ~F.text.in_(RESERVED))
async def handle_free_text(message: Message):
    try:
        user = await TelegramUser.objects.aget(telegram_id=message.from_user.id)
    except TelegramUser.DoesNotExist:
        from bot.handlers.start import get_or_create_user
        user = await get_or_create_user(message.from_user)

    # Save user message
    await ChatMessage.objects.acreate(user=user, role='user', text=message.text)

    # Try AI
    ai_response = ai_service.get_response(message.text)

    if ai_response:
        response_text = ai_response
    else:
        response_text = FALLBACK_TEXT

    # Save bot response
    await ChatMessage.objects.acreate(user=user, role='bot', text=response_text)

    await message.answer(response_text, reply_markup=main_menu_keyboard(), parse_mode='HTML')
