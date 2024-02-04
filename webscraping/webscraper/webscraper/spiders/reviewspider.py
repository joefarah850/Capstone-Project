import scrapy
# from webscraper.items import ReviewItem


class ReviewspiderSpider(scrapy.Spider):
    name = "reviewspider"
    allowed_domains = ["flatreviews.com"]
    start_urls = ["https://flatreviews.com/dubai/top-areas"]

    def parse(self, response):
        reviews = response.css('div.cell.auto')

        i = 0 
        for rev in reviews:
            relative_url = rev.xpath(f'/html/body/main/section[2]/div/div[3]/a[{i+1}]/@href').get()
            
            if relative_url == None:
                continue
            else:
                i += 1

            yield response.follow(relative_url, callback=self.parse_review_page)

        next_page_url = response.css('li a.next::attr(href)').get()

        if next_page_url is not None:
            yield response.follow(next_page_url, callback=self.parse)

    def parse_review_page(self, response):
        review_item = ReviewItem()

        review_item['url'] = response.url
        review_item['title'] = response.css('h1::text').get()

        reviews = response.css('section.fr-reviews-section div.cell.auto div.fr-review-module')

        review_item['reviews'] = []
        i = 0
        for rev in reviews:
            area = rev.css('div.fr-review-title::text').get()

            if area == None:
                continue
            else:
                i += 1
                review_item['reviews'].append(area)

            if len(reviews) > 20:
                if i == 20:
                    break


        return review_item
