from aiogram import BaseMiddleware
from aiogram.types import Message, CallbackQuery
from typing import Callable, Dict, Any, Awaitable
from bot.check_sub import is_user_subscribed
from bot.keyboards import subscription_keyboard

class SubscriptionMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message,
        data: Dict[str, Any]
    ) -> Any:
        if not isinstance(event, Message):
            return await handler(event, data)

        # /start komandasi va obunani tekshirish tugmasiga ruxsat beramiz
        if event.text == "/start":
            return await handler(event, data)

        user_id = event.from_user.id
        bot = data['bot']
        
        subscribed = await is_user_subscribed(bot, user_id)
        
        if not subscribed:
            await event.answer(
                "⚠️ <b>Botdan to'liq foydalanish uchun kanalimizga obuna bo'lishingiz shart!</b>\n\n"
                "Pastdagi tugmani bosib kanalga kiring va obuna bo'ling, so'ngra \"Obuna bo'ldim\" tugmasini bosing.",
                reply_markup=subscription_keyboard(),
                parse_mode='HTML'
            )
            return

        return await handler(event, data)
