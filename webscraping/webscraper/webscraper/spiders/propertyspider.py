import scrapy
from webscraper.items import PropertyItem


class PropertyspiderSpider(scrapy.Spider):
    name = "propertyspider"
    allowed_domains = ["emirates.estate"]
    start_urls = ["https://emirates.estate/property/dubai-emirate/dubai/"]

    def parse(self, response):
        properties = response.css('li div.info')

        for property in properties:
            num_bathrooms = property.css('div.params span.bathrooms b::text').get()
            relative_url = property.css('a::attr(href)').get()
            yield response.follow(relative_url, callback=self.parse_property_page, cb_kwargs={'num_bathrooms': num_bathrooms})

        next_page_url = response.css('li.next a::attr(href)').get()

        if next_page_url is not None:
            yield response.follow(next_page_url, callback=self.parse)

    def parse_property_page(self, response, num_bathrooms):
        property_item = PropertyItem()

        property_item['url'] = response.url
        property_item['title'] = response.css('h1::text').get()
        property_item['city'] = response.css('div.params div.city span.value::text').get()
        property_item['region'] = response.css('div.params div.region span.value a::text').get()
        property_item['type'] = response.css('div.params div.tip span.value::text').get()
        property_item['num_rooms'] = response.css('div.params div.rooms span.value::text').get()
        property_item['num_bathrooms'] = num_bathrooms
        property_item['size'] = response.css('div.params div.square span.value::text').get()
        property_item['price'] = response.css('div.price_info div.value span::text').get()
        
        if property_item['type'] == 'Development':
            return
        return property_item