import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from aiogram import Router, F
from aiogram.filters import CommandStart
from conversations.models import TelegramUser, Message as ChatMessage
from bot.keyboards import main_menu_keyboard, subscription_keyboard
from bot.check_sub import is_user_subscribed
from aiogram.types import Message, CallbackQuery

router = Router()


async def get_or_create_user(tg_user) -> TelegramUser:
    user, _ = await TelegramUser.objects.aget_or_create(
        telegram_id=tg_user.id,
        defaults={
            'username': tg_user.username or '',
            'full_name': tg_user.full_name or '',
            'language_code': tg_user.language_code or 'uz',
        }
    )
    # Update name if changed
    if user.full_name != (tg_user.full_name or ''):
        user.full_name = tg_user.full_name or ''
        await user.asave(update_fields=['full_name', 'last_active'])
    return user


@router.message(CommandStart())
async def cmd_start(message: Message):
    user = await get_or_create_user(message.from_user)
    bot = message.bot

    await ChatMessage.objects.acreate(user=user, role='user', text='/start')

    # Obunani tekshirish
    subscribed = await is_user_subscribed(bot, user.telegram_id)
    
    if not subscribed:
        await message.answer(
            f"Assalomu alaykum, {user.full_name or 'do\'st'}! 👋\n\n"
            "Botdan foydalanish uchun kanalimizga obuna bo'lishingiz kerak:",
            reply_markup=subscription_keyboard(),
            parse_mode='HTML'
        )
        return

    welcome_text = (
        f"Assalomu alaykum, {user.full_name or 'do\'st'}! 👋\n\n"
        "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!\n\n"
        "Men <b>Do'stlik tumani AI Maslahatchisi</b>man.\n"
        "🏡 Sizga davlat xizmatlari va ijtimoiy masalalarda yordam beraman.\n\n"
        "👇 <b>Quyidagi tugmalardan birini tanlang yoki savolingizni yozing:</b>"
    )

    await message.answer(
        welcome_text,
        reply_markup=main_menu_keyboard(),
        parse_mode='HTML'
    )


@router.callback_query(F.data == "check_subscription")
async def process_check_sub(callback: CallbackQuery):
    user_id = callback.from_user.id
    bot = callback.bot
    
    subscribed = await is_user_subscribed(bot, user_id)
    
    if subscribed:
        # Show a short notification popup
        await callback.answer("✅ Tasdiqlandi!")
        
        # Delete the previous message and send the menu
        await callback.message.delete()
        
        user = await get_or_create_user(callback.from_user)
        
        welcome_text = (
            f"Assalomu alaykum, {user.full_name or 'do\'st'}! 👋\n\n"
            "Siz muvaffaqiyatli ro'yxatdan o'tdingiz!\n\n"
            "Men <b>Do'stlik tumani AI Maslahatchisi</b>man.\n"
            "🏡 Sizga davlat xizmatlari va ijtimoiy masalalarda yordam beraman.\n\n"
            "👇 <b>Quyidagi tugmalardan birini tanlang yoki savolingizni yozing:</b>"
        )
        
        await callback.message.answer(
            welcome_text,
            reply_markup=main_menu_keyboard(),
            parse_mode='HTML'
        )
    else:
        # Show alert if not subscribed
        await callback.answer(
            "❌ Siz hali kanalga obuna bo'lmadingiz! \nIltimos, avval obuna bo'ling va keyin qayta urinib ko'ring.", 
            show_alert=True
        )
