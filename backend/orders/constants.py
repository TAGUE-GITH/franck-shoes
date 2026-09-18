DELIVERY_FEES = {
    'Douala': 2000,
    'Yaoundé': 2500,
    'Bafoussam': 3000,
    'Garoua': 4000,
    'Maroua': 4500,
    'Autre': 5000,
}


CITY_CHOICES = [
    (city, city)
    for city in DELIVERY_FEES.keys()
]