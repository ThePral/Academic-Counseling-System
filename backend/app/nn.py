import datetime

# تعریف زمان شروع و پایان
start_time = datetime.datetime.strptime("08:00", "%H:%M")
end_time = datetime.datetime.strptime("14:00", "%H:%M")

# لیستی برای ذخیره دوره‌های زمانی
time_slots = []

# تقسیم بندی زمان به دوره‌های یک ساعته
current_time = start_time
while current_time < end_time:
    time_slots.append(current_time.strftime("%H:%M"))
    current_time += datetime.timedelta(hours=1)

# نمایش دوره‌های زمانی
for slot in time_slots:
    print(slot)


import jdatetime
from datetime import date

def jalali_to_gregorian(jalali_str: str) -> date:
    parts = list(map(int, jalali_str.split("-")))
    return jdatetime.date(parts[0], parts[1], parts[2]).togregorian()
print(jalali_to_gregorian("1404-02-30"))