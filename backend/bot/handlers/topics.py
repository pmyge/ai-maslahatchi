import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from aiogram import Router, F
from aiogram.types import Message
from conversations.models import TelegramUser, Message as ChatMessage
from knowledge.models import Topic, FAQ
from bot.keyboards import TOPICS, main_menu_keyboard, back_keyboard

router = Router()

# Map button text → topic slug
BUTTON_TO_SLUG = {label: slug for label, slug in TOPICS}


@router.message(F.text.in_({label for label, _ in TOPICS}))
async def handle_topic(message: Message):
    slug = BUTTON_TO_SLUG.get(message.text)
    if not slug:
        return

    try:
        user = await TelegramUser.objects.aget(telegram_id=message.from_user.id)
    except TelegramUser.DoesNotExist:
        from bot.handlers.start import get_or_create_user
        user = await get_or_create_user(message.from_user)

    try:
        topic = await Topic.objects.aget(slug=slug, is_active=True)
    except Topic.DoesNotExist:
        await message.answer("Bu mavzu hozircha mavjud emas. ⏳", reply_markup=main_menu_keyboard())
        return

    # Log user message
    await ChatMessage.objects.acreate(user=user, role='user', text=message.text, topic=topic)

    # Get FAQ for this topic
    faqs = [faq async for faq in FAQ.objects.filter(topic=topic, is_active=True)]

    if faqs:
        faq = faqs[0]
        response_text = (
            f"{topic.emoji} <b>{topic.title}</b>\n\n"
            f"{faq.answer}\n\n"
            f"─────────────────────\n"
            f"✅ Agar xohlasangiz, yana savol berishingiz mumkin\n"
            f"✍️ Erkin savol uchun \"Savol berish\" tugmasini bosing"
        )
    else:
        response_text = (
            f"{topic.emoji} <b>{topic.title}</b>\n\n"
            f"Bu mavzu bo'yicha ma'lumot yaqinda qo'shiladi.\n"
            f"Hozircha tegishli idoraga murojaat qiling.\n\n"
            f"🏢 <b>Do'stlik tumani Davlat xizmatlari markazi:</b>\n"
            f"Do'stlik tumani, markaziy ko'cha\n\n"
            f"✅ Agar xohlasangiz, yana savol berishingiz mumkin"
        )

    # Log bot response
    await ChatMessage.objects.acreate(user=user, role='bot', text=response_text, topic=topic)

    await message.answer(response_text, reply_markup=back_keyboard(), parse_mode='HTML')


@router.message(F.text == "🏠 Asosiy menyu")
async def back_to_main(message: Message):
    await message.answer(
        "Asosiy menyu 👇",
        reply_markup=main_menu_keyboard()
    )
