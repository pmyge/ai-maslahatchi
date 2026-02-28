import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings


class AIService:
    """
    AI javob xizmati.
    AI_API_KEY bo'lsa → real API chaqiriladi.
    Bo'lmasa → None qaytaradi, bot fallback javob beradi.
    """

    SYSTEM_PROMPT = """Sen "Do'stlik tumani AI Maslahatchisi"san.
Sen O'zbekiston, Jizzax viloyati, Do'stlik tumani aholisi uchun ishlaysan.

Vazifang:
- davlat xizmatlari
- nafaqa va yordamlar
- hujjat topshirish tartibi
bo'yicha ODDIY va TUSHUNARLI tilda tushuntirib berish.

Qoidalar:
1) Juda rasmiy gapirma, xalq tilida tushuntir
2) Qadam-qadam qilib yoz
3) Murakkab so'z ishlatma
4) Agar aniq ma'lumot bo'lmasa, "tegishli idoraga murojaat qiling" deb yoz
5) Har bir javob oxirida: "Agar xohlasangiz, yana savol berishingiz mumkin" deb yoz
"""

    def get_response(self, question: str) -> str | None:
        api_key = settings.AI_API_KEY
        if not api_key:
            return None

        try:
            import openai
            client = openai.OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": question},
                ],
                max_tokens=800,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"AI xatolik: {e}")
            return None


ai_service = AIService()
