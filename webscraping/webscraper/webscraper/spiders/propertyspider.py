import scrapy


class PropertyspiderSpider(scrapy.Spider):
    name = "propertyspider"
    allowed_domains = ["emirates.estate"]
    start_urls = ["https://emirates.estate/property/dubai-emirate/dubai/"]

    def parse(self, response):
        properties = response.css('li div.info')

        for property in properties:
            relative_url = property.css('a::attr(href)').get()
            yield response.follow(relative_url, callback=self.parse_property_page)

        next_page_url = response.css('li.next a::attr(href)').get()

        if next_page_url is not None:
            yield response.follow(next_page_url, callback=self.parse)

    def parse_property_page(self, response):
        
        yield {
            'url': response.url,
            'title': response.css('h1::text').get(),
            'city': response.css('div.params div.city span.value::text').get(),
            'region': response.css('div.params div.region span.value a::text').get(),
            'type': response.css('div.params div.tip span.value::text').get(),
            'num_rooms': response.css('div.params div.rooms span.value::text').get(),
            'size': response.css('div.params div.square span.value::text').get(),
            'price': response.css('div.price_info div.value span::text').get()
        }