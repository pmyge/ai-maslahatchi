from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton

# 10 ta asosiy mavzu tugmalari
TOPICS = [
    ("💰 Bolalar nafaqasi", "children_benefit"),
    ("🏠 Moddiy yordam", "social_aid"),
    ("🪪 Pasport olish/almashtirish", "passport"),
    ("🏫 Maktabga qabul", "school"),
    ("🧒 Bog'chaga navbat", "kindergarten"),
    ("💍 Nikoh hujjatlari", "marriage"),
    ("🚔 Jarimalar", "fines"),
    ("📋 Doimiy ro'yxat", "registration"),
    ("💡 Subsidiyalar", "subsidy"),
    ("🏢 Davlat xizmatlari markazi", "gov_center"),
]


def main_menu_keyboard() -> ReplyKeyboardMarkup:
    """Asosiy menyu — 2 ustunli tugmalar"""
    buttons = []
    row = []
    for i, (label, _) in enumerate(TOPICS):
        row.append(KeyboardButton(text=label))
        if len(row) == 2:
            buttons.append(row)
            row = []
    if row:
        buttons.append(row)
    buttons.append([KeyboardButton(text="✍️ Savol berish")])

    return ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)


def back_keyboard() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="✍️ Savol berish")],
            [KeyboardButton(text="🏠 Asosiy menyu")]
        ],
        resize_keyboard=True
    )


def subscription_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📢 Kanalga obuna bo'lish", url="https://t.me/dustliknews")],
            [InlineKeyboardButton(text="✅ Obuna bo'ldim", callback_data="check_subscription")]
        ]
    )
