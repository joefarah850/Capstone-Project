# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class WebscraperItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()

class PropertyItem(scrapy.Item):
    url = scrapy.Field()
    title = scrapy.Field()
    city = scrapy.Field()
    region = scrapy.Field()
    type = scrapy.Field()
    num_rooms = scrapy.Field()
    size = scrapy.Field()
    price = scrapy.Field()
