from aiogram import Bot
from django.conf import settings
from aiogram.enums import ChatMemberStatus
import logging

logger = logging.getLogger(__name__)

async def is_user_subscribed(bot: Bot, user_id: int) -> bool:
    """Kanalga obunani tekshirish"""
    try:
        logger.info(f"Checking subscription for user {user_id} in channel {settings.CHANNEL_ID}")
        member = await bot.get_chat_member(chat_id=settings.CHANNEL_ID, user_id=user_id)
        logger.info(f"User {user_id} status: {member.status}")
        return member.status in [
            ChatMemberStatus.MEMBER,
            ChatMemberStatus.ADMINISTRATOR,
            ChatMemberStatus.CREATOR
        ]
    except Exception as e:
        logger.error(f"Subscription check error for user {user_id}: {e}")
        # In case of error (e.g. user not found, bot not admin), we return False to be safe
        # but let's log it clearly.
        return False
